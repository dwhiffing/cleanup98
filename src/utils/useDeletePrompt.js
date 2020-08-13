import { fs, rmdir } from './fileSystem'
import {
  PERMISSIONS_ERROR,
  DELETE_CONFIRM_PROMPT,
  DELETE_PROMPT,
} from '../constants.js'
import { useUpgradeState } from '../utils/useUpgradeState'
import { useWindowState } from '../utils/useWindowState'

export const useDeletePrompt = () => {
  const [upgrades] = useUpgradeState()
  const [, actions] = useWindowState()
  const speed = getDeleteSpeed(upgrades)

  const showDeletePrompt = (files, opts = {}) => {
    let anyDirectory
    try {
      anyDirectory = files.some((path) => fs.statSync(path).isDirectory())
    } catch (e) {
      return
    }
    if (anyDirectory && !upgrades.includes('delete-folders')) {
      return actions.addWindow(PERMISSIONS_ERROR)
    }

    const onDelete = () => deleteFiles(files, opts.onComplete)
    const startDelete = () => {
      actions.addWindow({ ...DELETE_PROMPT, speed, onComplete: onDelete })
      return true
    }
    const startConfirm = () => {
      actions.addWindow({
        ...DELETE_CONFIRM_PROMPT,
        buttons: [
          { text: 'Yes', onClick: startDelete },
          { text: 'No', onClick: () => true },
        ],
      })
    }

    opts.confirm ? startConfirm() : startDelete()
  }

  return showDeletePrompt
}

export const deleteFiles = (files, onComplete = () => {}) => {
  try {
    Promise.all(files.map((path) => rmdir(path))).then(onComplete)
  } catch (e) {
    console.log(e)
  }
}

export const getDeleteSpeed = (upgrades) => {
  if (upgrades.includes('delete-speed-3')) return 50
  if (upgrades.includes('delete-speed-2')) return 100
  if (upgrades.includes('delete-speed-1')) return 150
  return 200
}
