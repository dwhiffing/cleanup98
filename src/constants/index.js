import trashFullPng from '../assets/trash-full.png'
import errorPng from '../assets/error.png'

export const WIN_PROMPT = {
  type: 'prompt',
  image: trashFullPng,
  title: 'Success',
  label: 'You win!',
}

export const ALREADY_INSTALLED_ERROR = {
  type: 'prompt',
  image: errorPng,
  title: 'Error',
  label: 'Already have this upgrade',
}

export const NOT_ENOUGH_SPACE_ERROR = {
  type: 'prompt',
  image: errorPng,
  title: 'Error',
  label: "You don't have enough free space",
}

export const PERMISSIONS_ERROR = {
  type: 'prompt',
  image: errorPng,
  title: 'Administrator',
  label: "You don't have permission to delete this folder.",
}

export const DRIVE_PROPERTIES_MENU = { type: 'drive-properties' }

export const ADD_PROGRAMS_MENU = { type: 'add-programs' }
export const UPGRADES = [
  {
    key: 'delete-speed-1',
    name: 'Delete speed',
    cost: 10,
    description: 'Reduce the time it takes to delete a file',
  },
  {
    key: 'delete-speed-2',
    name: 'Delete speed 2',
    cost: 100,
    description: 'Reduce the time it takes to delete a file further',
  },
  {
    key: 'delete-speed-3',
    name: 'Delete speed 3',
    cost: 1000,
    description: 'Reduce the time it takes to delete a file even further',
  },
  {
    key: 'select-multiple',
    name: 'Select multiple',
    cost: 100,
    description: 'Allow selection of multiple files',
  },
  {
    key: 'select-box',
    name: 'Select box',
    cost: 100,
    description: 'Allow selection of multiple files via box',
  },
  {
    key: 'delete-folders',
    name: 'Delete folders',
    cost: 100,
    description: 'Allow deletion of folders',
  },
]