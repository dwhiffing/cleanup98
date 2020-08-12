import * as BrowserFS from 'browserfs'
import filePng from '../assets/txt.png'
import folderPng from '../assets/folder.png'
import faker from 'faker'
import Promise from 'bluebird'

export const fs = BrowserFS.BFSRequire('fs')
export const promiseFs = Promise.promisifyAll(fs)
export const path = BrowserFS.BFSRequire('path')

export const randomFs = function (config) {
  let promise = config.wipe ? rmdir(config.path) : Promise.resolve()

  return promise.then(function () {
    let promises = []

    for (let i = 0; i < config.number; i++) {
      let name
      let dirPath = []
      let directories = {}
      let depth = Math.round(Math.random() * config.depth)

      for (let j = 0; j < depth; j++) {
        if (directories.hasOwnProperty(`${j}`)) {
          let ar = directories[`${j}`]
          let index = Math.ceil(Math.random() * ar.length)
          if (index === ar.length) {
            name = randomName(2)
            ar.push(name)
          } else {
            name = ar[index]
          }
        } else {
          name = randomName(2)
          directories[`${j}`] = [name]
        }
        dirPath.push(name)
      }
      dirPath = dirPath.join(path.sep)

      const filepath =
        path.resolve(process.cwd(), config.path, dirPath, randomName(2)) +
        '.' +
        faker.system.fileExt()
      const content = faker.lorem.paragraph(1)

      promises.push(addFile(filepath, content))
    }

    return Promise.all(promises)
  })
}

export const addFile = (filepath, content) =>
  mkdir(path.dirname(filepath)).then(() =>
    promiseFs.writeFileAsync(filepath, content, 'utf8'),
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
    return promiseFs.readFileAsync(_file.path).then((f) => f.toString())
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
        return {
          ...file,
          type: isFolder ? 'folder' : 'file',
          isFolder,
          image: isFolder ? folderPng : filePng,
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
    randomFs({ path: './C:', depth: 0, number: 10 })
    randomFs({ path: './C:/Windows', depth: 4, number: 30 })
    randomFs({ path: './C:/My Documents', depth: 0, number: 25 })
  },
)
