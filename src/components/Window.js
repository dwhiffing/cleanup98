import React from 'react'
import Draggable from 'react-draggable'
import { Resizable } from 're-resizable'

export const Window = ({
  title = '',
  maximized,
  index = 0,
  zIndex = 0,
  minimized,
  onClose,
  onActive,
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
      defaultPosition={{ x: index * 20, y: index * 20 }}
      handle=".title-bar"
    >
      <div
        ref={nodeRef}
        onClick={onActive}
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
              <div className="title-bar-text">{title}</div>
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
                overflow: 'scroll',
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
