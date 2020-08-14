import * as BrowserFS from 'browserfs'
import txtPng from '../assets/txt.png'
import exePng from '../assets/exe.png'
import notePng from '../assets/note.png'
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
import { UPGRADES } from '../constants'

export const fs = BrowserFS.BFSRequire('fs')
export const promiseFs = Promise.promisifyAll(fs)
export const path = BrowserFS.BFSRequire('path')

export const randomFs = function (config) {
  let promise = config.wipe ? rmdir(config.path) : Promise.resolve()

  return promise.then(function () {
    let promises = []

    for (let i = 0; i < config.number; i++) {
      const extension = sample(config.extensions) || 'txt'
      const filepath =
        path.resolve(process.cwd(), config.path, randomName(2)) +
        '.' +
        extension
      EXTENSION_CONTENT[extension]((content) => {
        promises.push(addFile(filepath, content, 'utf8'))
      })
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
    await promiseFs.mkdirAsync('/C:')
    await promiseFs.mkdirAsync('/C:/My Documents')
    await promiseFs.mkdirAsync('/C:/Program Files')
    await promiseFs.mkdirAsync('/C:/Windows')

    randomFs({ path: './C:', number: 10, extensions: ['bat', 'dll', 'ini'] })
    randomFs({
      path: './C:/Windows',
      number: 30,
      extensions: ['bat', 'dll', 'ini'],
    })
    randomFs({
      path: './C:/Windows/System32',
      number: 30,
      extensions: ['bat', 'dll', 'ini'],
    })
    randomFs({
      path: './C:/downloads',
      number: 30,
      extensions: ['jpg', 'gif', 'bmp', 'exe'],
    })
    randomFs({
      path: './C:/notes',
      number: 20,
      extensions: ['txt'],
    })
    randomFs({
      path: './C:/My Documents',
      number: 25,
      extensions: ['bmp', 'txt'],
    })
    // randomFs({ path: './C:/Acrobat', number: 30 })
    // randomFs({ path: './C:/Outlook', number: 30 })
    // randomFs({ path: './C:/Compaq', number: 30 })
  },
)

const EXTENSION_IMAGES = {
  exe: exePng,
  txt: txtPng,
  not: notePng,
  dll: batPng,
  bat: batPng,
  bmp: bmpPng,
  jpg: bmpPng,
  gif: bmpPng,
  ini: iniPng,
  cfg: unknownPng,
}

const EXTENSION_CONTENT = {
  exe: (cb) => cb(faker.lorem.paragraph(100)),
  txt: (cb) => cb(faker.lorem.paragraph(1)),
  not: (cb) => cb(faker.lorem.paragraph(10)),
  dll: (cb) => cb(faker.lorem.paragraph(50)),
  bat: (cb) => cb(faker.lorem.paragraph(50)),
  ini: (cb) => cb(faker.lorem.paragraph(50)),
  cfg: (cb) => cb(faker.lorem.paragraph(50)),
  jpg: (cb) => {
    imgGen.generateImage(10, 10, 80, function (err, content) {
      cb(Base64.fromUint8Array(content.data))
    })
  },
  gif: (cb) => {
    imgGen.generateImage(50, 50, 80, function (err, content) {
      cb(Base64.fromUint8Array(content.data))
    })
  },
  bmp: (cb) => {
    imgGen.generateImage(100, 100, 80, function (err, content) {
      cb(Base64.fromUint8Array(content.data))
    })
  },
}

// TODO
// first delete txt files in unprotected folders
// get some delete speed upgrades to speed up this process
// unlock basic permissions to access bigger files
// get auto deleter and start clearing out folders full of text
// unlock permissions level 2 and get enough space for auto deleter
// use auto deleter to purge permissions level 2 folders
// get upgrade that automatically focuses/opens a new window of no files are left
// use that data to unlock windows permissions
// delete all windows data
// delete all program data
// win the game

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
  if (path.match(/\/Windows/)) return 3
  // if (path.match(/\/downloads/)) return 0
  if (path === '/C:/notes') return 0
  if (path.match(/\.txt/)) return 0
  if (path === '/C:') return 0
  return 1
}
