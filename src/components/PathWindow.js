import React, { useState, useEffect, useRef } from 'react'
import Draggable from 'react-draggable'
import { Resizable } from 're-resizable'
import { useHotkeys } from 'react-hotkeys-hook'
import { fs, getDirectories } from '../utils/files.js'
import { Icon } from './Icon'
import deleteFilePng from '../assets/delete-file.png'
import Selection from '@simonwep/selection-js'
import { deletePaths, getUpgrade } from '../utils'
import errorPng from '../assets/error.png'

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
  let isFolder = useRef()
  let canSelectBox = useRef(getUpgrade('select-box'))
  let canSelectMultiple = useRef(
    canSelectBox.current || getUpgrade('select-multiple'),
  )
  let selectionRef = useRef()
  let isSelectingRef = useRef()
  let children
  const [value, setValue] = useState(0)
  const [selected, setSelected] = useState([])
  const [directories, setDirectories] = useState([])
  const [content, setContent] = useState([])
  const [speed, setSpeed] = useState(0)

  useEffect(() => {
    const file = getUpgrade('delete-speed-1')
    const file2 = getUpgrade('delete-speed-2')
    const file3 = getUpgrade('delete-speed-3')
    let newSpeed = 200
    if (file) newSpeed = 150
    if (file2) newSpeed = 100
    if (file3) newSpeed = 50
    setSpeed(newSpeed)
  }, [])

  try {
    if (isFolder.current) {
      children = directories.map((item) => (
        <Icon
          key={`item-${item.name}`}
          item={item}
          addWindow={addWindow}
          onClick={() => {
            if (selected.length > 0 && !canSelectMultiple.current) return

            setSelected((selected) => [...selected, item.name])
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
    try {
      isFolder.current = fs.statSync(window.path).isDirectory()
      isFolder.current
        ? setDirectories(getDirectories({ path: window.path }))
        : setContent(fs.readFileSync(window.path).toString())
    } catch (e) {}
    if (isActive && canSelectBox.current) {
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

  const showDeleteProgress = (_files) => {
    const files = _files.map((file) => `${window.path}/${file}`)
    console.log(speed)
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
            const stats = files.map((path) => fs.statSync(path))
            const canDeleteFolder = getUpgrade('delete-folders')
            if (stats.some((stat) => stat.isDirectory()) && !canDeleteFolder) {
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
        if (
          !isSelectingRef.current &&
          (!e.target.classList.contains('icon-button') || selected.length > 0)
        )
          setSelected([])
        onActive(window)
      }}
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
            className="window"
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
