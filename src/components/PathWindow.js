import React, { useState, useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Window } from './Window'
import { fs, getDirectories } from '../utils/files.js'
import { Item } from './Item'
import deleteFilePng from '../assets/delete-file.png'
import Selection from '@simonwep/selection-js'

export const PathWindow = ({
  window,
  addWindow,
  removeWindow,
  onMinimize,
  onMaximize,
  onActive,
  isActive,
  index,
}) => {
  let isFolder = useRef()
  let selectionRef = useRef()
  let isSelectingRef = useRef()
  let children
  const [value, setValue] = useState(0)
  const [selected, setSelected] = useState([])
  const [directories, setDirectories] = useState([])
  const [content, setContent] = useState([])

  try {
    if (isFolder.current) {
      children = directories.map((item) => (
        <Item
          key={`item-${item.name}`}
          item={item}
          addWindow={addWindow}
          onClick={() => setSelected((selected) => [...selected, item.name])}
          selected={selected.includes(item.name)}
        />
      ))
    } else {
      children = <p key={`content-${window.path}`}>{content}</p>
    }
  } catch (e) {
    console.log(e)
    removeWindow(window.index)
  }

  useEffect(() => {
    isFolder.current = fs.statSync(window.path).isDirectory()
    isFolder.current
      ? setDirectories(getDirectories({ path: window.path }))
      : setContent(fs.readFileSync(window.path).toString())
    if (isActive) {
      // TODO: make select box visible
      selectionRef.current = new Selection({
        class: 'selection',
        selectables: ['.window .icon-item'],
        boundaries: ['.window'],
      })
      selectionRef.current.on('start', (evt) => {
        isSelectingRef.current = true
      })
      selectionRef.current.on('move', (evt) => {
        setSelected(evt.selected.map((c) => c.textContent.split('\n')[0]))
      })
      selectionRef.current.on('stop', (evt) => {
        setTimeout(() => {
          isSelectingRef.current = false
        }, 100)
      })
    } else {
      selectionRef.current && selectionRef.current.destroy()
    }
  }, [window.path, value, isActive])

  const showDeleteProgress = (files) => {
    addWindow({
      type: 'delete-prompt',
      duration: 10,
      paths: files.map((file) => `${window.path}/${file}`),
      title: 'Deleting...',
      onComplete: () => {
        setValue(Date.now())
      },
    })
  }

  const showConfirmDeletePrompt = (files) => {
    addWindow({
      type: 'prompt',
      title: 'Confirm File Delete',
      image: deleteFilePng,
      buttons: [
        {
          text: 'Yes',
          onClick: () => {
            showDeleteProgress(files)
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
      showConfirmDeletePrompt(selected)
      setSelected([])
    },
    {},
    [selected, isActive],
  )

  useEffect(() => {
    if (!isActive) {
      setSelected([])
    }
  }, [isActive])

  return (
    <Window
      key={`window-${window.index}`}
      onMaximize={() => onMaximize(window)}
      onClick={(e) => {
        if (!isSelectingRef.current) setSelected([])
        onActive(window)
      }}
      onMinimize={() => onMinimize(window)}
      onClose={() => removeWindow(window.index)}
      zIndex={index}
      {...window}
    >
      {children}
    </Window>
  )
}
