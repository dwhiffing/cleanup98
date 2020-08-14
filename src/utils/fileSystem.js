import * as BrowserFS from 'browserfs'
import folderPng from '../assets/folder.png'
import drivePng from '../assets/drive.png'
import Promise from 'bluebird'
import { sample } from 'lodash'
import {
  UPGRADES,
  EXTENSION_CONTENT,
  EXTENSION_IMAGES,
  INITIAL_DIRECTORIES,
  SPECIAL_FILE_NAMES,
} from '../constants'

export const fs = BrowserFS.BFSRequire('fs')
export const promiseFs = Promise.promisifyAll(fs)
export const path = BrowserFS.BFSRequire('path')

export const randomFs = function (config) {
  let promise = config.wipe ? rmdir(config.path) : Promise.resolve()

  return promise.then(function () {
    let promises = []

    for (let i = 0; i < config.number; i++) {
      try {
        const extension = sample(config.extensions) || 'txt'
        const filepath =
          path.resolve(
            process.cwd(),
            config.path,
            SPECIAL_FILE_NAMES[extension](),
          ) +
          '.' +
          extension
        EXTENSION_CONTENT[extension]((content) => {
          promises.push(addFile(filepath, content, 'utf8'))
        })
      } catch (e) {}
    }

    return Promise.all(promises)
  })
}

export const addFile = (filepath, content, format) => {
  mkdir(path.dirname(filepath)).then(() =>
    promiseFs.writeFileAsync(filepath, content, format),
  )
}

export const mkdir = (filepath) =>
  promiseFs.mkdirAsync(filepath).catch(function (e) {
    if (e.code === 'EEXIST' && e.errno === 17) return
    if (e.code === 'ENOENT' && e.errno === 2) {
      return mkdir(path.dirname(filepath)).then(() =>
        promiseFs.mkdirAsync(filepath),
      )
    }
    throw e
  })

export async function rmdir(filepath) {
  let files = []
  try {
    let fileStat = await promiseFs.statAsync(filepath)
    if (fileStat.isDirectory()) {
      files = await promiseFs.readdirAsync(filepath)
      for (let fileName of files) {
        let filePath = path.join(filepath, fileName)
        let fileStat = await promiseFs.statAsync(filePath)
        if (fileStat.isDirectory()) {
          await rmdir(filePath)
        } else {
          await promiseFs.unlinkAsync(filePath)
        }
      }
      await promiseFs.rmdirAsync(filepath)
    } else {
      await promiseFs.unlinkAsync(filepath)
    }
  } catch (e) {}
}

export async function getFileSizeForPath(directoryName, result = []) {
  let stat = await promiseFs.statAsync(directoryName)
  let files

  try {
    if (stat.isDirectory()) {
      files = await promiseFs.readdirAsync(directoryName)
    } else {
      result.push(stat.size)
      files = []
    }
  } catch (e) {}

  for (let f of files) {
    let fullPath = path.join(directoryName, f)
    let stat
    try {
      stat = await promiseFs.statAsync(fullPath)
      if (stat.isDirectory()) {
        await getFileSizeForPath(fullPath, result)
      } else {
        result.push(stat.size)
      }
    } catch (e) {}
  }

  return result.reduce((sum, n) => sum + n, 0) / 1024.0
}

export async function getContentForPath(_file) {
  const stat = await promiseFs.statAsync(_file.path)
  if (!stat.isDirectory()) {
    return promiseFs.readFileAsync(_file.path).then((f) => {
      return f.toString()
    })
  }

  return promiseFs
    .readdirAsync(_file.path)
    .map((file) => {
      const fullPath = path.join(_file.path, file)
      return Promise.props({
        stat: promiseFs.statAsync(fullPath),
        accessLevel: getAccessLevel(fullPath),
        size: getFileSizeForPath(fullPath),
        path: fullPath,
        name: file,
      })
    })
    .all()
    .then((files) =>
      files.map((file) => {
        const isFolder = file.stat.isDirectory()
        const isDrive = file.path === '/C:'
        const extension = file.name.split('.')[1]
        return {
          ...file,
          type: isFolder ? 'folder' : 'file',
          isFolder,
          image: isDrive
            ? drivePng
            : isFolder
            ? folderPng
            : EXTENSION_IMAGES[extension],
        }
      }),
    )
}

BrowserFS.install(window)
BrowserFS.configure(
  {
    fs: 'LocalStorage',
  },
  async function (e) {
    if (e) {
      throw e
    }
    const hasFs = localStorage.getItem('has-fs')
    if (hasFs) return

    localStorage.setItem('has-fs', 'true')

    Object.entries(INITIAL_DIRECTORIES).forEach(([path, opts]) =>
      randomFs({ path, ...opts }),
    )
  },
)

export const getUpgrades = async () => {
  let upgrades = []
  try {
    upgrades = await promiseFs.readdirAsync(`/C:/Program Files`)
  } catch (e) {}
  let output = {}
  upgrades.forEach((u) => {
    const [key, level] = u.replace('.exe', '').split('_') || [0]
    output[key] = +level
  })
  UPGRADES.forEach((u) => {
    const currentUpgrade = upgrades.find((upgrade) => {
      const [key] = upgrade.replace('.exe', '').split('_')
      return key === u.key
    })
    let level = 0
    if (currentUpgrade) {
      level = currentUpgrade.replace('.exe', '').split('_')[1]
    }
    output[u.key] = level ? +level : 0
  })
  return output
}

const getAccessLevel = (path) => {
  const _path = path.replace(/\w+\.\w+/, '')
  const directory = INITIAL_DIRECTORIES[_path]
  if (directory && typeof directory.accessLevel === 'number')
    return directory.accessLevel
  return 0
}
