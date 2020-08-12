import React, { useState, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import uniq from 'lodash/uniq'
import Draggable from 'react-draggable'
import { Resizable } from 're-resizable'
import { Icon } from './Icon'
import Window from './Window'
import { getUpgrades } from '../utils'
import { fs, getContentForPath } from '../utils/files'
import { useSelectBox } from '../utils/useSelectBox'
import { showDeletePrompt } from '../utils/showDeletePrompt'
import { RESIZEABLE_SIDES } from '../constants/index'

export const PathWindow = ({
  windowData,
  zIndex,
  addWindow,
  removeWindow,
  onMinimize,
  onMaximize,
  onActive,
  isActive,
}) => {
  const nodeRef = React.useRef(null)
  const [upgrades, setUpgrades] = useState([])
  const [content, setContent] = useState([])
  const [value, setValue] = useState(0)
  // TODO: refactor coordsRef, selectingRef, cleanup effects properly
  const [selected, setSelected, coordsRef, selectingRef] = useSelectBox({
    start: { x: zIndex * 20, y: zIndex * 20 },
    disabled: !isActive || !upgrades.includes('select-box'),
  })

  useEffect(() => {
    if (!isActive) setSelected([])
    getContentForPath({ path: windowData.path }).then(setContent)
    getUpgrades().then((u) => setUpgrades(u.map((t) => t.replace('.txt', ''))))
  }, [windowData.path, value, isActive, setSelected])

  useHotkeys(
    'backspace,delete',
    () => {
      if (!isActive || selected.length === 0) return
      const files = selected.map((file) => `${windowData.path}/${file}`)
      const onDelete = () => setValue((v) => v + 1)
      setSelected([])
      showDeletePrompt({ files, upgrades, addWindow, onDelete })
    },
    {},
    [selected, isActive],
  )

  const onClickWindow = ({ target }) => {
    if (!selectingRef.current && !target.classList.contains('icon-button'))
      setSelected([])
    onActive(windowData)
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
      children = content.map((item) => (
        <Icon
          key={`item-${item.name}`}
          item={item}
          addWindow={addWindow}
          onClick={getOnClickIcon(item)}
          selected={selected.includes(item.name)}
        />
      ))
    } else {
      children = <p key={`content-${windowData.path}`}>{content}</p>
    }
  } catch (e) {
    removeWindow(windowData.index)
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
          <Window
            key={`window-${windowData.index}`}
            isActive={isActive}
            onMinimize={() => onMinimize(windowData)}
            onMaximize={() => onMaximize(windowData)}
            onClose={() => removeWindow(windowData.index)}
            windowData={windowData}
          >
            {children}
          </Window>
        </Resizable>
      </div>
    </Draggable>
  )
}
