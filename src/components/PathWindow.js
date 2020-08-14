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
import { ContextMenu } from './ContextMenu'

export const PathWindow = ({ windowData, zIndex, isActive, onClose }) => {
  const nodeRef = useRef(null)
  const [children, setChildren] = useState(null)
  const [upgrades] = useUpgradeState()
  const [, actions] = useWindowState()
  const { files: _files, updatePath, removePath } = useFileState()
  const showDeletePrompt = useDeletePrompt()
  const startPosX = Math.min(98, zIndex * 14)
  const startPosY = Math.min(259, zIndex * 37)
  const [selected, setSelected, coordsRef, selectingRef] = useSelectBox({
    start: { x: startPosX, y: startPosY },
    disabled: !isActive || !upgrades['select-box'],
  })
  const onClickWindow = ({ target }) => {
    if (!selectingRef.current && !target.classList.contains('icon-button'))
      setSelected([])
    actions.onActive(windowData)
  }

  let files = _files[windowData.path] || []
  useEffect(() => {
    const getOnClickIcon = (item) => () => {
      if (selected.length > 0) {
        return setSelected(() => [item.name])
      }

      setSelected((selected) => uniq([...selected, item.name]))
    }

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
      if (extension.match(/bmp|gif|jpg/)) {
        setChildren(
          <img
            className="crisp"
            src={`data:image/jpg;base64,${files}`}
            style={{ width: '100%' }}
            alt="random"
          />,
        )
      } else if (extension.match(/txt|doc/)) {
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

  const selectedFiles =
    files.filter &&
    files.filter((f) =>
      selected.find((file) => f.path === `${windowData.path}/${file}`),
    )
  useHotkeys(
    'backspace,delete',
    () => {
      if (!isActive || selected.length === 0) return

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
    <>
      {isActive && <ContextMenu files={files} selected={selectedFiles} />}

      <Draggable
        handle=".title-bar"
        nodeRef={nodeRef}
        disabled={windowData.maximized}
        position={windowData.maximized ? { x: 0, y: 0 } : null}
        bounds={{ left: 0, top: 0 }}
        onDrag={(event, node) => {
          coordsRef.current = { x: node.x, y: node.y }
        }}
        defaultPosition={{
          x: window.innerWidth / 4 + startPosX,
          y: window.innerWidth / 20 + startPosY,
        }}
      >
        <div
          ref={nodeRef}
          className="absolute"
          onClick={onClickWindow}
          style={{ display: windowData.minimized ? 'none' : 'block', zIndex }}
        >
          <Resizable
            enable={RESIZEABLE_SIDES}
            minWidth={200}
            minHeight={200}
            defaultSize={{
              width: window.innerWidth / 2,
              height: window.innerWidth / 3,
            }}
            size={
              windowData.maximized
                ? {
                    width: window.innerWidth - 5,
                    height: window.innerHeight - 5,
                  }
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
    </>
  )
}
