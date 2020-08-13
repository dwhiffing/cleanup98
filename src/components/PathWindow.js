import React, { useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import uniq from 'lodash/uniq'
import Draggable from 'react-draggable'
import { Resizable } from 're-resizable'
import { Icon } from '../components/Icon'
import { fs } from '../utils/fileSystem'
import { useSelectBox } from '../utils/useSelectBox'
import { useDeletePrompt } from '../utils/useDeletePrompt'
import { RESIZEABLE_SIDES } from '../constants'
import { useWindowState } from '../utils/useWindowState'
import { useUpgradeState } from '../utils/useUpgradeState'
import { useFileState } from '../utils/useFileState'

export const PathWindow = ({ windowData, zIndex, isActive, onClose }) => {
  const nodeRef = useRef(null)
  const [upgrades] = useUpgradeState()
  const [, actions] = useWindowState()
  const { files: _files, updatePath, removePath } = useFileState()
  const showDeletePrompt = useDeletePrompt()
  const [selected, setSelected, coordsRef, selectingRef] = useSelectBox({
    start: { x: zIndex * 20, y: zIndex * 20 },
    disabled: !isActive || !upgrades.includes('select-box'),
  })

  const files = _files[windowData.path] || []

  useEffect(() => {
    if (!isActive) setSelected([])
    if (isActive) updatePath(windowData.path)
  }, [windowData.path, isActive, setSelected])

  useHotkeys(
    'backspace,delete',
    () => {
      if (!isActive || selected.length === 0) return
      const files = selected.map((file) => `${windowData.path}/${file}`)
      showDeletePrompt(files, {
        confirm: true,
        onComplete: () => {
          files.forEach((file) => {
            removePath(file)
          })
        },
      })
      setSelected([])
    },
    {},
    [selected, isActive],
  )

  const onClickWindow = ({ target }) => {
    if (!selectingRef.current && !target.classList.contains('icon-button'))
      setSelected([])
    actions.onActive(windowData)
  }

  const getOnClickIcon = (item) => () => {
    if (selected.length > 0 && !upgrades.includes('select-multiple')) {
      return setSelected(() => [item.name])
    }

    setSelected((selected) => uniq([...selected, item.name]))
  }

  let children
  try {
    // TODO: make async
    if (fs.statSync(windowData.path).isDirectory()) {
      children = files.map((item) => (
        <Icon
          key={`item-${item.name}`}
          item={item}
          addWindow={actions.addWindow}
          onClick={getOnClickIcon(item)}
          selected={selected.includes(item.name)}
        />
      ))
    } else {
      children = <p key={`files-${windowData.path}`}>{files}</p>
    }
  } catch (e) {
    actions.removeWindow(windowData.index)
  }

  return (
    <Draggable
      handle=".title-bar"
      nodeRef={nodeRef}
      disabled={windowData.maximized}
      position={windowData.maximized ? { x: 0, y: 0 } : null}
      bounds={{ left: 0, top: 0 }}
      onDrag={(event, node) => {
        coordsRef.current = { x: node.x, y: node.y }
      }}
      defaultPosition={{ x: zIndex * 20, y: zIndex * 20 }}
    >
      <div
        ref={nodeRef}
        className="absolute"
        onClick={onClickWindow}
        style={{ display: windowData.minimized ? 'none' : 'block', zIndex }}
      >
        <Resizable
          enable={RESIZEABLE_SIDES}
          minWidth={640}
          minHeight={400}
          defaultSize={{ width: 640, height: 400 }}
          size={
            windowData.maximized
              ? { width: window.innerWidth - 5, height: window.innerHeight - 5 }
              : null
          }
        >
          <div className={`window w-full h-full flex flex-col`}>
            <div className="title-bar">
              <div className="title-bar-text">
                {windowData.title || windowData.path || ''}
              </div>
              <div className="title-bar-controls">
                <button
                  onClick={() => actions.onMinimize(windowData)}
                  aria-label="Minimize"
                ></button>
                <button
                  onClick={() => actions.onMaximize(windowData)}
                  aria-label="Maximize"
                ></button>
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
