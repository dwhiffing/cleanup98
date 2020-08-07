import React from 'react'
import Draggable from 'react-draggable'
import { Resizable } from 're-resizable'

export const Window = ({
  title = '',
  maximized,
  minimized,
  onClose,
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
      handle=".title-bar"
    >
      <div
        ref={nodeRef}
        style={{
          display: minimized ? 'none' : 'block',
          zIndex: 10,
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
          minWidth={320}
          minHeight={200}
          defaultSize={{
            width: 320,
            height: 200,
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
            <div className="window-body-white" style={{ flex: 1 }}>
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
