import React, { useState, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Window } from './Window'
import { fs, getDirectories } from '../utils/files.js'
import { Item } from './Item'

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

  useHotkeys(
    'backspace,delete',
    () => {
      if (!isActive) return
      selected.forEach((file) => {
        setSelected((selected) => selected.filter((f) => f !== file))
        onDelete(`${window.path}/${file}`)
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
      <button onClick={() => onDelete(window.path)}>delete</button>
    </Window>
  )
}
