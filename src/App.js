import React, { useState, useEffect, useRef } from 'react'
import { TaskBar } from './components/TaskBar'
import { getFiles, rmdir, path, fs } from './utils/files.js'
import './index.css'
import '98.css'
import { PathWindow } from './components/PathWindow'
import { Item } from './components/Item'
import timePng from './assets/time.png'
import errorPng from './assets/error.png'
import trashFullPng from './assets/trash-full.png'
import { Prompt } from './components/Prompt'
import { DeletePrompt } from './components/DeletePrompt'
import { DrivePropertiesMenu } from './components/DrivePropertiesMenu'
import { AddProgramsMenu } from './components/AddProgramsMenu'
import { ProgressPrompt } from './components/ProgressPrompt'

let windowId = 0

function App() {
  const [windows, setWindows] = useState([])
  const [capacity, setCapacity] = useState(0)
  const [tree, setTree] = useState([])
  const [contextMenu, setContextMenu] = useState(false)

  useEffect(() => {
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

  useEffect(() => {
    if (tree.length > 0 && !capacity) setCapacity(tree[0].size)
  }, [tree, capacity])

  const addWindow = (window) => {
    let index = windowId
    setWindows((windows) => [...windows, { ...window, index }])
    windowId++
    return index
  }

  useIntro({ skip: true, addWindow, onComplete: () => setTree(getFiles()) })

  const updateFiles = () => {
    setTree(getFiles())
  }
  const openProperties = () => {
    updateFiles()
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

  const getUpgrade = (key) => {
    let result
    try {
      result = fs.readFileSync(`/C:/Program Files/${key}.txt`)
    } catch (e) {}
    return result
  }

  const onDelete = (paths, onComplete) => {
    const stats = paths.map((path) => fs.statSync(path))
    let canDeleteFolder = getUpgrade('delete-folders')
    if (stats.some((stat) => stat.isDirectory()) && !canDeleteFolder) {
      addWindow({
        type: 'prompt',
        image: errorPng,
        title: 'Administrator',
        label: "You don't have permission to delete this folder.",
      })
    } else {
      Promise.all(paths.map((path) => rmdir(path))).then(() => {
        onComplete && onComplete()
      })
    }
  }

  const actions = {
    addWindow,
    removeWindow,
    onActive,
    onMinimize,
    onMaximize,
    onDelete,
  }

  const usedSpace = tree.length > 0 ? tree[0].children[0].size : 0
  const freeSpace = capacity - usedSpace

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

        if (window.type === 'progress-prompt')
          return (
            <ProgressPrompt
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
              addWindow={addWindow}
              removeWindow={removeWindow}
              {...window}
            />
          )

        if (window.type === 'drive-properties') {
          return (
            <DrivePropertiesMenu
              key={`window-${window.index}`}
              capacity={capacity}
              freeSpace={freeSpace}
              usedSpace={usedSpace}
              onClose={() => removeWindow(window.index)}
              {...window}
            />
          )
        }

        if (window.type === 'add-programs')
          return (
            <AddProgramsMenu
              key={`window-${window.index}`}
              freeSpace={freeSpace}
              updateFiles={updateFiles}
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
        updateFiles={updateFiles}
        addWindow={addWindow}
        onClickWindowItem={(window) => {
          // if window is active, should minimize
          // if window is minimized, should maximize
          // if window is inactive, should make active
          onMinimize(window)
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

const useIntro = ({ addWindow, onComplete, skip }) => {
  useEffect(() => {
    if (skip) {
      onComplete()
      return
    }
    addWindow({
      type: 'prompt',
      image: trashFullPng,
      allowClose: false,
      height: 130,
      title: 'Hard Disk is Full',
      label:
        'You have run out of space on drive C.\n\nTo free space on this drive by deleting old or unnecessary files, click Disk Cleanup.',
      buttons: [
        {
          text: 'Disk Cleanup',
          onClick: () => {
            addWindow({
              type: 'progress-prompt',
              title: 'Running Disk Cleanup...',
              image: trashFullPng,
              allowClose: false,
              callback: () => {
                addWindow({
                  type: 'prompt',
                  image: errorPng,
                  title: 'Windows has encountered an error',
                  label:
                    // 'Disk Cleanup Utility not found.  Please remove files manually by clicking on them and pressing delete.',
                    'Disk Cleanup Utility not found.  Please remove all files from this computer manually by clicking on them and pressing delete.',
                  buttons: [
                    {
                      text: 'OK',
                      onClick: () => {
                        onComplete()
                        return true
                      },
                    },
                  ],
                })
                return true
              },
            })
            return true
          },
        },
      ],
    })
  }, [])
}
