import { fs, rmdir } from './files.js'

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

export const getUpgrade = (key) => {
  let result
  try {
    result = fs.readFileSync(`/C:/Program Files/${key}.txt`)
  } catch (e) {}
  return result
}
