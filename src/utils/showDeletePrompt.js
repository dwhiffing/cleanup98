import { fs, rmdir } from '../utils/fileSystem'
import {
  PERMISSIONS_ERROR,
  DELETE_CONFIRM_PROMPT,
  DELETE_PROMPT,
} from '../constants/index.js'

const canDelete = (files, upgrades) => {
  const anyDirectory = files.some((path) => fs.statSync(path).isDirectory())
  if (anyDirectory && !upgrades.includes('delete-folders')) {
    return false
  }
  return true
}

const deleteFilesWithValidation = (files, upgrades, addWindow, onComplete) => {
  if (!canDelete(files, upgrades)) return addWindow(PERMISSIONS_ERROR)
  try {
    Promise.all(files.map((path) => rmdir(path))).then(() => {
      onComplete && onComplete()
    })
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

export const showDeletePrompt = ({ files, upgrades, addWindow, onDelete }) => {
  const speed = getDeleteSpeed(upgrades)
  const onComplete = () =>
    deleteFilesWithValidation(files, upgrades, addWindow, onDelete)

  addWindow({
    ...DELETE_CONFIRM_PROMPT,
    buttons: [
      {
        text: 'Yes',
        onClick: () => {
          addWindow({ ...DELETE_PROMPT, speed, onComplete })
          return true
        },
      },
      { text: 'No', onClick: () => true },
    ],
  })
}
