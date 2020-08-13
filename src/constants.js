import trashFullPng from './assets/trash-full.png'
import deleteFilePng from './assets/delete-file.png'
import errorPng from './assets/error.png'
import installPng from './assets/install.png'
import drivePng from './assets/drive.png'
import computerPng from './assets/computer.png'

export const WIN_PROMPT = {
  type: 'prompt',
  image: trashFullPng,
  title: 'Success',
  label: 'You win!',
}

export const ERROR_PROMPT = {
  type: 'prompt',
  image: errorPng,
  title: 'Error',
  label: 'Windows has encountered an error.',
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
  label: "You don't have permission to delete this.",
}

export const DELETE_PROMPT = {
  type: 'progress-prompt',
  title: 'Deleting...',
  image: deleteFilePng,
  allowClose: true,
}

export const DELETE_CONFIRM_PROMPT = {
  type: 'prompt',
  title: 'Confirm File Delete',
  label: 'Are you sure you want to send this to the Recycle Bin?',
  image: deleteFilePng,
}

export const DRIVE_PROPERTIES_MENU = {
  type: 'drive-properties',
  title: 'Drive Properties',
}

export const ADD_PROGRAMS_MENU = {
  type: 'add-programs',
  title: 'Install Programs',
}
export const UPGRADES = [
  {
    key: 'delete-speed',
    name: 'Delete speed',
    cost: 100,
    costFactor: 2,
    maxLevel: 10,
    description: 'Reduce the time it takes to delete a file',
  },
  {
    key: 'select-box',
    name: 'Select box',
    cost: 1000,
    maxLevel: 1,
    description: 'Allow selection of multiple files via box',
  },
  {
    key: 'autodeleter',
    name: 'Auto deleter',
    cost: 1000,
    costFactor: 2,
    maxLevel: 10,
    description:
      'Auto deletes the smallest file in the active window every 10 seconds',
  },
  {
    key: 'permissions',
    name: 'File Access Level',
    cost: 1000,
    costFactor: 2,
    maxLevel: 5,
    description: 'Allows navigation and deletion of protected files',
  },

  // hotkeys?
]

export const RESIZEABLE_SIDES = {
  top: false,
  right: true,
  bottom: true,
  left: false,
  topRight: false,
  bottomRight: true,
  bottomLeft: false,
  topLeft: false,
}

export const DESKTOP_ICONS = [
  {
    type: 'folder',
    name: 'My Computer',
    image: computerPng,
    isFolder: true,
    path: '/',
  },
  {
    type: 'folder',
    name: 'Install Programs',
    image: installPng,
    onDoubleClick: () => ADD_PROGRAMS_MENU,
  },
  {
    type: 'folder',
    name: 'Drive Properties',
    image: drivePng,
    onDoubleClick: () => DRIVE_PROPERTIES_MENU,
  },
]
