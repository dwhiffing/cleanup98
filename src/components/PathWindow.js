import React, { useState, useEffect, useRef } from 'react'
import Draggable from 'react-draggable'
import { Resizable } from 're-resizable'
import { useHotkeys } from 'react-hotkeys-hook'
import { fs, getContentForPath } from '../utils/files.js'
import { Icon } from './Icon'
import deleteFilePng from '../assets/delete-file.png'
import Selection from '@simonwep/selection-js'
import { deletePaths, getUpgrades } from '../utils'
import uniq from 'lodash/uniq'
import { PERMISSIONS_ERROR } from '../constants/index.js'

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
  let coordsRef = useRef({ x: zIndex * 20, y: zIndex * 20 })
  let selectingRef = useRef()
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
            if (selected.length > 0 && !upgrades.includes('select-multiple')) {
              return setSelected(() => [item.name])
            }

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
        mode: 'center',
        selectionAreaContainer: '.drag-window',
        selectables: ['.drag-window .icon-item'],
        boundaries: ['.drag-window'],
        startareas: ['.drag-window'],
      })
      selectionRef.current.on('start', (evt) => {
        selectingRef.current = true
      })
      selectionRef.current.on('move', ({ selected, area }) => {
        area.style.marginLeft = `-${coordsRef.current.x}px`
        area.style.marginTop = `-${coordsRef.current.y}px`
        setSelected(selected.map((c) => c.innerText.split('\n')[0]))
      })
      selectionRef.current.on('stop', (evt) => {
        setTimeout(() => {
          selectingRef.current = false
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
              addWindow(PERMISSIONS_ERROR)
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
      onClick={({ target }) => {
        if (!selectingRef.current && !target.classList.contains('icon-button'))
          setSelected([])
        onActive(window)
      }}
      isActive={isActive}
      onMinimize={() => onMinimize(window)}
      onClose={() => removeWindow(window.index)}
      zIndex={zIndex}
      coordsRef={coordsRef}
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
  coordsRef,
}) => {
  const nodeRef = React.useRef(null)
  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={maximized}
      position={maximized ? { x: 0, y: 0 } : null}
      bounds={{ left: 0, top: 0 }}
      onDrag={(event, node) => {
        coordsRef.current = { x: node.x, y: node.y }
      }}
      defaultPosition={{ x: zIndex * 20, y: zIndex * 20 }}
      handle=".title-bar"
    >
      <div
        ref={nodeRef}
        onClick={onClick}
        className="absolute"
        style={{ display: minimized ? 'none' : 'block', zIndex: 10 + zIndex }}
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
          defaultSize={{ width: 640, height: 400 }}
        >
          <div className={`window w-full h-full flex flex-col`}>
            <div className="title-bar">
              <div className="title-bar-text">{title || path}</div>
              <div className="title-bar-controls">
                <button onClick={onMinimize} aria-label="Minimize"></button>
                <button onClick={onMaximize} aria-label="Maximize"></button>
                <button onClick={onClose} aria-label="Close"></button>
              </div>
            </div>
            <div
              className={`${
                isActive ? 'drag-window' : ''
              } window-body-white flex flex-1 flex-wrap overflow-auto content-start items-start justify-start`}
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
