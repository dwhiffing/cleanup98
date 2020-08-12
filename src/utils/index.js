import { promiseFs } from './files.js'

export const getUpgrades = async () => {
  let result = { then: () => [] }
  try {
    result = promiseFs.readdirAsync(`/C:/Program Files`)
  } catch (e) {}
  return result
}
