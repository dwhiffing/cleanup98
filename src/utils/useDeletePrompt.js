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

  const showDeletePrompt = (files, opts = {}) => {
    const anyDirectory = files.some((f) => f.isFolder)
    if (anyDirectory && !upgrades.includes('delete-folders')) {
      return actions.addWindow(PERMISSIONS_ERROR)
    }
    const totalSizeKb = files.reduce((sum, f) => sum + f.size, 0)
    const speed = getDeleteSpeed(upgrades, totalSizeKb)

    const onDelete = () =>
      deleteFiles(
        files.map((f) => f.path),
        opts.onComplete,
      )
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

export const getDeleteSpeed = (upgrades, totalSize) => {
  let rate = 1
  if (upgrades.includes('delete-speed-3')) rate = 4
  if (upgrades.includes('delete-speed-2')) rate = 3
  if (upgrades.includes('delete-speed-1')) rate = 2

  return (totalSize * 1024) / rate
}
