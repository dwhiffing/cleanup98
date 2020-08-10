import { promiseFs, rmdir } from './files.js'

export const deletePaths = (paths, onComplete, validate = () => true) => {
  try {
    const valid = validate()

    if (!valid) return

    Promise.all(paths.map((path) => rmdir(path))).then(() => {
      onComplete && onComplete()
    })
  } catch (e) {
    console.log(e)
  }
}

export const getUpgrades = async () => {
  let result = { then: () => [] }
  try {
    result = promiseFs.readdirAsync(`/C:/Program Files`)
  } catch (e) {}
  return result
}
