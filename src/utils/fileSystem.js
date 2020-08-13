import * as BrowserFS from 'browserfs'
import txtPng from '../assets/txt.png'
import exePng from '../assets/exe.png'
import bmpPng from '../assets/bmp.png'
import batPng from '../assets/bat.png'
import unknownPng from '../assets/unknown.png'
import iniPng from '../assets/ini.png'
import folderPng from '../assets/folder.png'
import drivePng from '../assets/drive.png'
import faker from 'faker'
import Promise from 'bluebird'
import { sample } from 'lodash'
import imgGen from 'js-image-generator'
import { Base64 } from 'js-base64'

export const fs = BrowserFS.BFSRequire('fs')
export const promiseFs = Promise.promisifyAll(fs)
export const path = BrowserFS.BFSRequire('path')
export const getUpgrades = async () => {
  let upgrades = []
  try {
    upgrades = await promiseFs.readdirAsync(`/C:/Program Files`)
  } catch (e) {}
  return upgrades.map((t) => t.replace('.txt', ''))
}
// TODO: expand on inital file system, add new directories with bigger files that require permissions
export const randomFs = function (config) {
  let promise = config.wipe ? rmdir(config.path) : Promise.resolve()

  return promise.then(function () {
    let promises = []

    for (let i = 0; i < config.number; i++) {
      const extension = sample(FILE_EXTENSIONS)
      const filepath =
        path.resolve(process.cwd(), config.path, randomName(2)) +
        '.' +
        extension
      if (extension === 'bmp') {
        // TODO: should randomize size to create different sized files
        imgGen.generateImage(100, 100, 80, function (err, content) {
          const data = Base64.fromUint8Array(content.data)
          promises.push(addFile(filepath, data, 'utf8'))
        })
      } else {
        const content = faker.lorem.paragraph(1)
        promises.push(addFile(filepath, content, 'utf8'))
      }
    }

    return Promise.all(promises)
  })
}

export const addFile = (filepath, content, format) =>
  mkdir(path.dirname(filepath)).then(() =>
    promiseFs.writeFileAsync(filepath, content, format),
  )

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

function randomName(wordCount) {
  let strings = []
  while (wordCount-- > 0) {
    strings.push(faker.system.fileExt())
  }
  return strings.join('-')
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
    await promiseFs.mkdirAsync('/C:')
    await promiseFs.mkdirAsync('/C:/My Documents')
    await promiseFs.mkdirAsync('/C:/Program Files')
    await promiseFs.mkdirAsync('/C:/Windows')
    //TODO
    // should be able to specify likelyhood of each file
    // should define a few folder archetypes:
    // user files (mostly txt, bmp, nested 1 or 2 levels)
    // program files (mostly dll, cfg, exe nested 3 or 4 levels)
    // system files (mostly dll, cfg, exe, unknown nested 6 or 8 levels)
    randomFs({ path: './C:', number: 10 })
    randomFs({ path: './C:/Windows', number: 30 })
    randomFs({ path: './C:/Windows/System32', number: 30 })
    randomFs({ path: './C:/Outlook', number: 30 })
    randomFs({ path: './C:/Compaq', number: 30 })
    randomFs({ path: './C:/Acrobat', number: 30 })
    randomFs({ path: './C:/downloads', number: 100 })
    randomFs({ path: './C:/My Documents', number: 25 })
  },
)

const EXTENSION_IMAGES = {
  exe: exePng,
  txt: txtPng,
  dll: batPng,
  bat: batPng,
  bmp: bmpPng,
  ini: iniPng,
  cfg: unknownPng,
}

// tiny: 0.1kb
// small: 1kb
// medium: 50kb
// large: 200kb
// huge: 500kb

// txt files are small and common and need no permissions
// images files are medium sized and need no permissions but rare
// exe files are huge but rare and need max permissions
// cfg/bat/ini/dll files are medium sized but rare and need moderate permissions
// const FILE_EXTENSIONS = ['txt', 'dll', 'bat', 'exe', 'bmp', 'ini', 'cfg']
const FILE_EXTENSIONS = [
  'txt',
  'txt',
  'txt',
  'txt',
  'txt',
  'txt',
  'txt',
  'txt',
  'txt',
  'txt',
  'txt',
  'dll',
  'bat',
  'exe',
  'bmp',
  'ini',
  'cfg',
]
