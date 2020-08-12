import { promiseFs } from './files.js'

export const getUpgrades = async () => {
  let upgrades = []
  try {
    upgrades = await promiseFs.readdirAsync(`/C:/Program Files`)
  } catch (e) {}
  return upgrades.map((t) => t.replace('.txt', ''))
}
