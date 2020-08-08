import React, { useState, useEffect } from 'react'

import { TaskBar } from './components/TaskBar'
import { Window } from './components/Window'
import { Icon } from './components/Icon'
import { fs, path, getDirectories, getFiles, rmdir } from './utils/files.js'
import filePng from './assets/txt.png'
import folderPng from './assets/folder.png'
import './index.css'
import '98.css'

let windowId = 0

function App() {
  const [windows, setWindows] = useState([])
  const [tree, setTree] = useState([])

  useEffect(() => {
    setTree(getFiles())
  }, [])

  const addWindow = (window) =>
    setWindows((windows) => [...windows, { ...window, index: windowId++ }])

  const removeWindow = (index) =>
    setWindows((windows) => windows.filter((w) => w.index !== index))

  const updateWindow = (index, update) =>
    setWindows((windows) =>
      windows.map((w) => (w.index !== index ? w : { ...w, ...update }))
    )
  const onClose = (window) => removeWindow(window.index)
  const onMinimize = (window) =>
    updateWindow(window.index, { minimized: !window.minimized })
  const onMaximize = (window) =>
    updateWindow(window.index, { maximized: !window.maximized })

  const deleteFile = (path) => {
    rmdir(path).then(() => setTree(getFiles()))
  }

  return (
    <div>
      {windows.map((window) => {
        let children, isFolder
        try {
          isFolder = fs.statSync(window.path).isDirectory()
          if (isFolder) {
            children = getDirectories({ path: window.path }).map((item) => (
              <Item
                key={`item-${item.name}`}
                item={item}
                addWindow={addWindow}
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
          onClose(window)
        }

        return (
          <Window
            key={`window-${window.index}`}
            onMaximize={() => onMaximize(window)}
            onMinimize={() => onMinimize(window)}
            onClose={() => onClose(window)}
            {...window}
          >
            {children}
            <button onClick={() => deleteFile(window.path)}>delete</button>
          </Window>
        )
      })}

      <div style={{ position: 'absolute' }}>
        {tree.map((item) => (
          <Item
            key={`item-${item.name}`}
            addWindow={addWindow}
            item={item}
            textColor="white"
          />
        ))}
      </div>

      <TaskBar windows={windows} onClickWindowItem={onMinimize} />
    </div>
  )
}

export default App

const Item = ({ addWindow, item, textColor }) => {
  return (
    <Icon
      type="folder"
      label={item.name}
      image={item.image}
      textColor={textColor}
      onClick={() =>
        addWindow({
          title: item.name,
          path: item.path,
        })
      }
    />
  )
}
