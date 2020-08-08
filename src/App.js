import React, { useState, useEffect } from 'react'
import { TaskBar } from './components/TaskBar'
import { getFiles, rmdir } from './utils/files.js'
import './index.css'
import '98.css'
import { PathWindow } from './components/PathWindow'
import { Item } from './components/Item'

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
      windows.map((w) => (w.index !== index ? w : { ...w, ...update })),
    )
  const onActive = (window) => {
    setWindows((windows) =>
      windows.concat().sort((a, b) => {
        if (a.index === window.index) {
          return 1
        }
        if (b.index === window.index) {
          return -1
        }
        return 0
      }),
    )
  }
  const onMinimize = (window) =>
    updateWindow(window.index, { minimized: !window.minimized })
  const onMaximize = (window) =>
    updateWindow(window.index, { maximized: !window.maximized })

  const onDelete = (path) => {
    rmdir(path).then(() => setTree(getFiles()))
  }
  const actions = {
    addWindow,
    removeWindow,
    onActive,
    onMinimize,
    onMaximize,
    onDelete,
  }
  return (
    <div>
      {windows.map((window, index) => (
        <PathWindow
          key={`window-${window.index}`}
          window={window}
          isActive={window.index === windows[windows.length - 1].index}
          index={index}
          {...actions}
        />
      ))}

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

      <TaskBar
        windows={windows}
        onClickWindowItem={() => {
          // if window is active, should minimize
          // if window is minimized, should maximize
          // if window is inactive, should make active
          onMinimize()
        }}
      />
    </div>
  )
}

export default App
