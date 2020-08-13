import { rmdir } from './fileSystem'
import {
  PERMISSIONS_ERROR,
  DELETE_CONFIRM_PROMPT,
  DELETE_PROMPT,
} from '../constants.js'
import { useUpgradeState } from '../utils/useUpgradeState'
import { useWindowState } from '../utils/useWindowState'

//TODO should show delete confirmation?
const checkCanDelete = (files, upgrades) => {
  const anyDirectory = files.some((f) => f.isFolder)
  if (anyDirectory) {
    return PERMISSIONS_ERROR
  }
  const noAccess = files.some((f) => f.accessLevel > upgrades.permissions)
  if (noAccess) {
    return PERMISSIONS_ERROR
  }
}

export const useDeletePrompt = () => {
  const [upgrades] = useUpgradeState()
  const [, actions] = useWindowState()

  const showDeletePrompt = (files, opts = {}) => {
    const prompt = checkCanDelete(files, upgrades)
    if (prompt) {
      return actions.addWindow(prompt)
    }
    const totalSizeKb = files.reduce((sum, f) => sum + f.size, 0)
    const fileName =
      files.length === 1 ? files[0].name : `${files.length} files`
    const onDelete = () =>
      deleteFiles(
        files.map((f) => f.path),
        opts.onComplete,
      )
    const startDelete = () => {
      actions.addWindow({
        ...DELETE_PROMPT,
        title: `Deleting ${fileName} (${totalSizeKb.toFixed(2)}KB)...`,
        size: totalSizeKb,
        onComplete: onDelete,
      })
      return true
    }
    const startConfirm = () => {
      actions.addWindow({
        ...DELETE_CONFIRM_PROMPT,
        label: `Are you sure you want to send ${fileName} to the Recycle Bin?`,
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
  let rate = upgrades['delete-speed'] + 1

  return (totalSize * 1024) / rate
}
