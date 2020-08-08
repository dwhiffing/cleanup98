import React, { useState, useEffect, useRef } from 'react'
import { TaskBar } from './components/TaskBar'
import { getFiles, rmdir } from './utils/files.js'
import './index.css'
import '98.css'
import { PathWindow } from './components/PathWindow'
import { Item } from './components/Item'
import computerPng from './assets/computer.png'
import timePng from './assets/time.png'
import { Prompt } from './components/Prompt'
import { DeletePrompt } from './components/DeletePrompt'
import { DrivePropertiesMenu } from './components/DrivePropertiesMenu'

let windowId = 0

function App() {
  const [windows, setWindows] = useState([])
  const [tree, setTree] = useState([])
  const [contextMenu, setContextMenu] = useState(false)
  // const [desktop] = useState([
  //   {
  //     type: 'folder',
  //     name: 'My Computer',
  //     image: computerPng,
  //     isFolder: true,
  //     path: '/',
  //   },
  // ])

  useEffect(() => {
    setTree(getFiles())

    document.addEventListener(
      'contextmenu',
      function (e) {
        const listener = document.addEventListener('click', () => {
          setTimeout(() => {
            setContextMenu({ visible: false })
          }, 100)
          document.removeEventListener('click', listener)
        })
        if (e.target.classList.contains('drive')) {
          setContextMenu({
            visible: true,
            x: e.screenX,
            y: e.screenY - 130,
            buttons: [
              {
                text: 'Properties',
                onClick: () => openProperties(),
              },
            ],
          })
        }
        e.preventDefault()
      },
      false,
    )
  }, [])

  const addWindow = (window) => {
    let index = windowId
    setWindows((windows) => [...windows, { ...window, index }])
    windowId++
    return index
  }

  const openProperties = () => {
    addWindow({
      type: 'drive-properties',
    })
  }

  useClockSettingsPrompt({ addWindow })

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
      {windows.map((window, index) => {
        if (window.type === 'path')
          return (
            <PathWindow
              key={`window-${window.index}`}
              window={window}
              isActive={window.index === windows[windows.length - 1].index}
              index={index}
              {...actions}
            />
          )

        if (window.type === 'prompt')
          return (
            <Prompt
              key={`window-${window.index}`}
              onClose={() => removeWindow(window.index)}
              {...window}
            />
          )

        if (window.type === 'delete-prompt')
          return (
            <DeletePrompt
              key={`window-${window.index}`}
              onDelete={onDelete}
              removeWindow={removeWindow}
              {...window}
            />
          )

        if (window.type === 'drive-properties')
          return (
            <DrivePropertiesMenu
              key={`window-${window.index}`}
              onClose={() => removeWindow(window.index)}
              {...window}
            />
          )

        return null
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

      {contextMenu.visible && (
        <div
          style={{
            position: 'absolute',
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 99,
          }}
        >
          <div className="window" style={{ width: 80, height: 200 }}>
            {contextMenu.buttons.map((b) => (
              <button key={`button-${b.text}`} onClick={b.onClick}>
                {b.text}
              </button>
            ))}
          </div>
        </div>
      )}

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

const useClockSettingsPrompt = ({ addWindow }) => {
  const clockSettingsRef = useRef()
  useEffect(() => {
    const interval = setInterval(() => {
      if (clockSettingsRef.current || !addWindow) return
      clockSettingsRef.current = true
      addWindow({
        type: 'prompt',
        key: 'clock-settings',
        title: 'New Clock settings',
        image: timePng,
        buttons: [
          {
            text: 'OK',
            onClick: () => {
              clockSettingsRef.current = false
              return true
            },
          },
        ],
        label:
          'Windows has updated your clock settings as a result of Daylight Savings Time. Please verify that your new clock settings are correct.',
      })
      return () => clearInterval(interval)
    }, 60000)
  }, [])
}
