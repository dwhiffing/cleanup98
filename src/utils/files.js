import * as BrowserFS from 'browserfs'
import computerPng from '../assets/computer.png'
import filePng from '../assets/txt.png'
import folderPng from '../assets/folder.png'
import React from 'react'
import schemata from 'object-schemata'
import faker from 'faker'
import Promise from 'bluebird'

export const fs = BrowserFS.BFSRequire('fs')
export const promiseFs = Promise.promisifyAll(fs)
export const path = BrowserFS.BFSRequire('path')

localStorage.clear()
BrowserFS.install(window)
BrowserFS.configure(
  {
    fs: 'LocalStorage',
  },
  function (e) {
    if (e) {
      throw e
    }
    fs.mkdirSync('/C:')
  }
)

let rfsSchema = schemata({
  depth: {
    description: 'The deepest number of sub-directories to create.',
    defaultValue: 2,
    help: 'This must be a non-negative number.',
    transform: Math.round,
  },
  number: {
    description: 'The number of files to generate.',
    defaultValue: 25,
    help: 'This must be a non-negative number.',
    transform: Math.round,
  },
  path: {
    description:
      'The directory where the random file structure should be stored.',
    help: 'This must be a string.',
    validate: function (value, is) {
      return is.string(value) && value
    },
    required: true,
  },
  wipe: {
    description:
      'Whether to wipe the current file structure at that directory.',
    defaultValue: false,
    transform: function (value) {
      return !!value
    },
  },
})

export const randomFs = function (configuration) {
  let config = rfsSchema.normalize(configuration)
  let promise
  let result = {
    added: [],
    deleted: [],
    errors: [],
  }

  promise = config.wipe ? rmdir(config.path, result) : Promise.resolve()

  return promise
    .catch(function (e) {
      if (e.code === 'ENOENT' && e.errno === -2) return
      result.errors.push(
        '[DIR]  Could not wipe directory: ' + config.path + '\n' + e.stack
      )
    })
    .then(function () {
      let i
      let promises = []

      for (i = 0; i < config.number; i++) {
        ;(function () {
          let ar
          let content
          let depth
          let directories = {}
          let dirPath
          let filepath
          let index
          let j
          let name
          let promise

          depth = Math.round(Math.random() * config.depth)

          //generate the directory path
          dirPath = []
          for (j = 0; j < depth; j++) {
            if (directories.hasOwnProperty('' + j)) {
              ar = directories['' + j]
              index = Math.ceil(Math.random() * ar.length)
              if (index === ar.length) {
                name = randomName(2)
                ar.push(name)
              } else {
                name = ar[index]
              }
            } else {
              name = randomName(2)
              directories['' + j] = [name]
            }
            dirPath.push(name)
          }
          dirPath = dirPath.join(path.sep)

          content = faker.lorem.paragraph(1)

          filepath =
            path.resolve(process.cwd(), config.path, dirPath, randomName(2)) +
            '.' +
            faker.system.fileExt()

          promise = addFile(filepath, content, result)
          promises.push(promise)
        })()
      }

      return Promise.all(promises).then(function () {
        result.added.sort(sortResultSet)
        result.deleted.sort(sortResultSet)
        result.errors.sort(sortResultSet)
        return result
      })
    })
}

export function addFile(filepath, content, result) {
  let dirPath = path.dirname(filepath)
  return mkdir(dirPath, result)
    .then(function () {
      return promiseFs.writeFileAsync(filepath, content, 'utf8')
    })
    .then(function () {
      result.added.push('[FILE] ' + filepath)
    })
    .catch(function (e) {
      result.errors.push(
        '[FILE] Could not add file: ' + filepath + '\n' + e.stack
      )
    })
}

export function mkdir(filepath, result) {
  return promiseFs
    .mkdirAsync(filepath)
    .then(function () {
      result.added.push('[DIR]  ' + filepath)
    })
    .catch(function (e) {
      if (e.code === 'EEXIST' && e.errno === 17) return
      if (e.code === 'ENOENT' && e.errno === 2) {
        return mkdir(path.dirname(filepath), result)
          .then(function () {
            return promiseFs.mkdirAsync(filepath)
          })
          .then(function () {
            result.added.push('[DIR]  ' + filepath)
          })
          .catch(function (e) {
            if (e.code === 'EEXIST') return
            result.errors.push('[DIR]  Could not make directory: ' + filepath)
          })
      }
      throw e
    })
}

export function rmdir(filepath, result) {
  return promiseFs.readdirAsync(filepath).then(function (filepaths) {
    let promises = []
    filepaths.forEach(function (fp) {
      let absPath = path.resolve(filepath, fp)
      let promise = promiseFs.statAsync(absPath).then(function (stat) {
        if (stat.isDirectory()) {
          return rmdir(absPath, result)
        } else {
          return promiseFs.unlinkAsync(absPath).then(function () {
            result.deleted.push('[FILE] ' + absPath)
          })
        }
      })
      promises.push(promise)
    })
    return Promise.all(promises).then(function () {
      return promiseFs
        .rmdirAsync(filepath)
        .then(function () {
          result.deleted.push('[DIR]  ' + filepath)
        })
        .catch(function (e) {
          result.errors.push('[DIR]  Could not delete directory: ' + filepath)
        })
    })
  })
}

function sortResultSet(a, b) {
  return a.substr(7) < b.substr(7) ? -1 : 1
}

function randomName(wordCount) {
  let result = []
  while (wordCount-- > 0) {
    result.push(faker.system.fileExt())
  }
  return result.join('-')
}

randomFs({ path: './C:', depth: 5, number: 25 })

export const getFiles = () => {
  function getDirectories(_file) {
    return fs.readdirSync(_file.path).map((file) => {
      const isFolder = fs.statSync(path.join(_file.path, file)).isDirectory()
      return {
        type: isFolder ? 'folder' : 'file',
        name: file,
        isFolder,
        image: isFolder ? folderPng : filePng,
        path: path.join(_file.path, file),
      }
    })
  }

  function getDirectoriesRecursive(file) {
    return {
      ...file,
      children: file.isFolder
        ? getDirectories(file).map(getDirectoriesRecursive)
        : [],
      content: file.isFolder ? null : (
        <p key={`content-${file.path}`}>
          {fs.readFileSync(file.path).toString()}
        </p>
      ),
    }
  }

  return [
    getDirectoriesRecursive({
      type: 'folder',
      name: 'My Computer',
      image: computerPng,
      isFolder: true,
      path: '/',
    }),
  ]
}
