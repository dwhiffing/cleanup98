import React, { useState, useEffect, useRef } from 'react'
import Draggable from 'react-draggable'
import { Resizable } from 're-resizable'
import { useHotkeys } from 'react-hotkeys-hook'
import { fs, getContentForPath } from '../utils/files.js'
import { Icon } from './Icon'
import deleteFilePng from '../assets/delete-file.png'
import Selection from '@simonwep/selection-js'
import { deletePaths, getUpgrades } from '../utils'
import errorPng from '../assets/error.png'
import uniq from 'lodash/uniq'

export const PathWindow = ({
  window,
  zIndex,
  addWindow,
  removeWindow,
  onMinimize,
  onMaximize,
  onActive,
  isActive,
}) => {
  const [upgrades, setUpgrades] = useState([])
  let selectionRef = useRef()
  let isSelectingRef = useRef()
  let children
  const [value, setValue] = useState(0)
  const [selected, setSelected] = useState([])
  const [content, setContent] = useState([])
  const [speed, setSpeed] = useState(0)

  // TODO: refactor

  useEffect(() => {
    // TODO: upgrades need to refresh when purchased
    getUpgrades().then((u) => {
      setUpgrades(u.map((t) => t.replace('.txt', '')))
    })
  }, [])

  useEffect(() => {
    let newSpeed = 200
    if (upgrades.includes('delete-speed-1')) newSpeed = 150
    if (upgrades.includes('delete-speed-2')) newSpeed = 100
    if (upgrades.includes('delete-speed-3')) newSpeed = 50
    setSpeed(newSpeed)
  }, [upgrades])

  try {
    // TODO: make async
    if (fs.statSync(window.path).isDirectory()) {
      children = content.map((item) => (
        <Icon
          key={`item-${item.name}`}
          item={item}
          addWindow={addWindow}
          onClick={() => {
            if (selected.length > 0 && !upgrades.includes('select-multiple'))
              return

            setSelected((selected) => uniq([...selected, item.name]))
          }}
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
    getContentForPath({ path: window.path }).then(setContent)

    if (isActive && upgrades.includes('select-box')) {
      // TODO: make select box visible
      selectionRef.current = new Selection({
        class: 'selection',
        selectables: ['.drag-window .icon-item'],
        boundaries: ['.drag-window'],
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
  }, [window.path, upgrades, value, isActive])

  const showDeleteProgress = (_files) => {
    const files = _files.map((file) => `${window.path}/${file}`)
    addWindow({
      type: 'progress-prompt',
      image: deleteFilePng,
      speed,
      title: 'Deleting...',
      onComplete: () => {
        deletePaths(
          files,
          () => {
            setValue(Date.now())
          },
          () => {
            // TODO: make async
            const anyDirectory = files.some((path) =>
              fs.statSync(path).isDirectory(),
            )
            if (anyDirectory && !upgrades.includes('delete-folders')) {
              addWindow({
                type: 'prompt',
                image: errorPng,
                title: 'Administrator',
                label: "You don't have permission to delete this folder.",
              })
              return false
            }
            return true
          },
        )
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
      if (!isActive || selected.length === 0) return
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
        if (
          !isSelectingRef.current &&
          (!e.target.classList.contains('icon-button') || selected.length > 0)
        )
          setSelected([])
        onActive(window)
      }}
      isActive={isActive}
      onMinimize={() => onMinimize(window)}
      onClose={() => removeWindow(window.index)}
      zIndex={zIndex}
      {...window}
    >
      {children}
    </Window>
  )
}

const Window = ({
  title = '',
  path,
  maximized,
  zIndex = 0,
  minimized,
  onClose,
  onClick,
  onMinimize,
  isActive,
  onMaximize,
  children,
}) => {
  const nodeRef = React.useRef(null)
  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={maximized}
      position={maximized ? { x: 0, y: 0 } : null}
      bounds={{ left: 0, top: 0 }}
      defaultPosition={{ x: zIndex * 20, y: zIndex * 20 }}
      handle=".title-bar"
    >
      <div
        ref={nodeRef}
        onClick={onClick}
        style={{
          display: minimized ? 'none' : 'block',
          zIndex: 10 + zIndex,
          position: 'absolute',
        }}
      >
        <Resizable
          enable={RESIZEABLE_SIDES}
          size={
            maximized
              ? { width: window.innerWidth - 5, height: window.innerHeight - 5 }
              : null
          }
          minWidth={640}
          minHeight={400}
          defaultSize={{
            width: 640,
            height: 400,
          }}
        >
          <div
            className={`window ${isActive ? 'drag-window' : ''}`}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="title-bar">
              <div className="title-bar-text">{title || path}</div>
              <div className="title-bar-controls">
                <button onClick={onMinimize} aria-label="Minimize"></button>
                <button onClick={onMaximize} aria-label="Maximize"></button>
                <button onClick={onClose} aria-label="Close"></button>
              </div>
            </div>
            <div
              className="window-body-white"
              style={{
                flex: 1,
                display: 'flex',
                flexWrap: 'wrap',
                overflow: 'auto',
                alignContent: 'flex-start',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}
            >
              {children}
            </div>
          </div>
        </Resizable>
      </div>
    </Draggable>
  )
}

const RESIZEABLE_SIDES = {
  top: false,
  right: true,
  bottom: true,
  left: false,
  topRight: false,
  bottomRight: true,
  bottomLeft: false,
  topLeft: false,
}
