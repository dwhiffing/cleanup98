import { fs, rmdir } from './fileSystem'
import {
  PERMISSIONS_ERROR,
  DELETE_CONFIRM_PROMPT,
  DELETE_PROMPT,
} from '../constants/index.js'
import { useUpgradeState, useWindowState } from './recoil'

export const useDeletePrompt = ({ onComplete }) => {
  const [upgrades] = useUpgradeState()
  const [, actions] = useWindowState()
  const speed = getDeleteSpeed(upgrades)

  const showDeletePrompt = (files) => {
    const anyDirectory = files.some((path) => fs.statSync(path).isDirectory())
    if (anyDirectory && !upgrades.includes('delete-folders')) {
      return actions.addWindow(PERMISSIONS_ERROR)
    }

    const onDelete = () => deleteFiles(files, onComplete)
    const startDelete = () => {
      actions.addWindow({ ...DELETE_PROMPT, speed, onComplete: onDelete })
      return true
    }

    actions.addWindow({
      ...DELETE_CONFIRM_PROMPT,
      buttons: [
        { text: 'Yes', onClick: startDelete },
        { text: 'No', onClick: () => true },
      ],
    })
  }

  return showDeletePrompt
}

const deleteFiles = (files, onComplete = () => {}) => {
  try {
    Promise.all(files.map((path) => rmdir(path))).then(onComplete)
  } catch (e) {
    console.log(e)
  }
}

const getDeleteSpeed = (upgrades) => {
  if (upgrades.includes('delete-speed-3')) return 50
  if (upgrades.includes('delete-speed-2')) return 100
  if (upgrades.includes('delete-speed-1')) return 150
  return 200
}
