import React, { useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import uniq from 'lodash/uniq'
import Draggable from 'react-draggable'
import { Resizable } from 're-resizable'
import { Icon } from '../components/Icon'
import { useSelectBox } from '../utils/useSelectBox'
import { useDeletePrompt } from '../utils/useDeletePrompt'
import { RESIZEABLE_SIDES, ERROR_PROMPT } from '../constants'
import { useWindowState } from '../utils/useWindowState'
import { useUpgradeState } from '../utils/useUpgradeState'
import { useFileState } from '../utils/useFileState'

export const PathWindow = ({ windowData, zIndex, isActive, onClose }) => {
  const nodeRef = useRef(null)
  const [children, setChildren] = useState(null)
  const [upgrades] = useUpgradeState()
  const [, actions] = useWindowState()
  const { files: _files, updatePath, removePath } = useFileState()
  const showDeletePrompt = useDeletePrompt()
  const [selected, setSelected, coordsRef, selectingRef] = useSelectBox({
    start: { x: zIndex * 20, y: zIndex * 20 },
    disabled: !isActive || !upgrades['select-box'],
  })

  const onClickWindow = ({ target }) => {
    if (!selectingRef.current && !target.classList.contains('icon-button'))
      setSelected([])
    actions.onActive(windowData)
  }

  useEffect(() => {
    const getOnClickIcon = (item) => () => {
      if (selected.length > 0 && !upgrades['select-multiple']) {
        return setSelected(() => [item.name])
      }

      setSelected((selected) => uniq([...selected, item.name]))
    }

    let files = _files[windowData.path] || []
    if (Array.isArray(files)) {
      setChildren(
        files
          .concat()
          .sort((a, b) => {
            if (a.isFolder) return -1
            if (b.isFolder) return 1
            return 0
          })
          .map((item) => (
            <Icon
              key={`item-${item.name}`}
              item={item}
              onClick={getOnClickIcon(item)}
              upgrades={upgrades}
              selected={selected.includes(item.name)}
            />
          )),
      )
    } else {
      const extension = windowData.title.split('.')[1]
      if (extension === 'bmp') {
        setChildren(
          <img
            className="crisp"
            src={`data:image/jpg;base64,${files}`}
            style={{ width: '100%' }}
            alt="random"
          />,
        )
      } else if (extension === 'txt') {
        setChildren(<p>{files.toString()}</p>)
      } else {
        actions.addWindow(ERROR_PROMPT)
        actions.removeWindow(windowData.index)
      }
    }
    // TODO: fix this
    // eslint-disable-next-line
  }, [_files, selected, upgrades])

  useEffect(() => {
    if (!isActive) setSelected([])
    if (isActive) updatePath(windowData.path)
    // TODO: fix this
    // eslint-disable-next-line
  }, [windowData.path, isActive, setSelected])

  useHotkeys(
    'backspace,delete',
    () => {
      if (!isActive || selected.length === 0) return
      const selectedFiles = _files[windowData.path].filter((f) =>
        selected.find((file) => f.path === `${windowData.path}/${file}`),
      )
      showDeletePrompt(selectedFiles, {
        confirm: true,
        onComplete: () => {
          selectedFiles.forEach((file) => removePath(file.path))
        },
      })
      setSelected([])
    },
    {},
    [selected, isActive],
  )

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
