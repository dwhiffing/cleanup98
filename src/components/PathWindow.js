import React, { useState, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Window } from './Window'
import { fs, getDirectories } from '../utils/files.js'
import { Item } from './Item'
import deleteFilePng from '../assets/delete-file.png'

export const PathWindow = ({
  window,
  addWindow,
  removeWindow,
  onMinimize,
  onMaximize,
  onActive,
  isActive,
  onDelete,
  index,
}) => {
  let children, isFolder
  const [selected, setSelected] = useState([])

  const showDeleteProgress = (file) => {
    const id = addWindow({
      type: 'prompt',
      title: 'Deleting...',
      image: deleteFilePng,
      allowClose: false,
      buttons: [],
      label: `From ${file}`,
    })
    setTimeout(() => {
      onDelete(`${window.path}/${file}`)
      removeWindow(id)
    }, 1000)
  }

  const showConfirmDeletePrompt = (file) => {
    addWindow({
      type: 'prompt',
      title: 'Confirm File Delete',
      image: deleteFilePng,
      buttons: [
        {
          text: 'Yes',
          onClick: () => {
            showDeleteProgress(file)
            return true
          },
        },
        {
          text: 'No',
          onClick: () => {
            return true
          },
        },
      ],
      label: 'Are you sure you want to send this to the Recycle Bin?',
    })
  }

  useHotkeys(
    'backspace,delete',
    () => {
      if (!isActive) return
      selected.forEach((file) => {
        setSelected((selected) => selected.filter((f) => f !== file))
        showConfirmDeletePrompt(file)
      })
    },
    {},
    [selected, isActive],
  )

  useEffect(() => {
    if (!isActive) {
      setSelected([])
    }
  }, [isActive])

  try {
    isFolder = fs.statSync(window.path).isDirectory()
    if (isFolder) {
      children = getDirectories({ path: window.path }).map((item) => (
        <Item
          key={`item-${item.name}`}
          item={item}
          addWindow={addWindow}
          onClick={() => setSelected((selected) => [...selected, item.name])}
          selected={selected.includes(item.name)}
        />
      ))
    } else {
      children = (
        <p key={`content-${window.path}`}>
          {fs.readFileSync(window.path).toString()}
        </p>
      )
    }
  } catch (e) {
    removeWindow(window.index)
  }

  return (
    <Window
      key={`window-${window.index}`}
      onMaximize={() => onMaximize(window)}
      onClick={(e) => {
        if (e.target.className !== 'icon-button') setSelected([])
        onActive(window)
      }}
      onMinimize={() => onMinimize(window)}
      onClose={() => removeWindow(window.index)}
      zIndex={index}
      {...window}
    >
      {children}
      {/* <div className="meter">
        <span style={{ width: '80%' }}></span>
      </div> */}
    </Window>
  )
}
