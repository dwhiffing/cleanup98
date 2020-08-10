import React from 'react'
import Draggable from 'react-draggable'

export const Prompt = ({
  title = '',
  label = '',
  allowClose = true,
  image,
  onClose,
  onClick,
  width = 400,
  height = 122,
  buttons = [{ text: 'OK', onClick: () => true }],
}) => {
  // TODO: refactor
  const nodeRef = React.useRef(null)
  return (
    <Draggable
      nodeRef={nodeRef}
      bounds={{ left: 0, top: 0 }}
      defaultPosition={{
        x: window.innerWidth / 2 - width / 2,
        y: window.innerHeight / 2 - height,
      }}
      handle=".title-bar"
    >
      <div
        ref={nodeRef}
        onClick={onClick}
        style={{
          zIndex: 90,
          position: 'absolute',
        }}
      >
        <div className="window" style={{ width, height }}>
          <div className="title-bar">
            <div className="title-bar-text">{title}</div>
            <div className="title-bar-controls">
              {allowClose && (
                <button aria-label="Close" onClick={onClose}></button>
              )}
            </div>
          </div>
          <div
            className="window-body"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                padding: '10px 0 10px',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              <img
                src={image}
                alt="logo"
                style={{ marginLeft: 10, marginRight: 20 }}
              />
              {label}
            </div>

            <div style={{ display: 'flex' }}>
              {buttons.map(({ onClick, text }) => (
                <button
                  key={`button-${text}`}
                  onClick={() => {
                    const shouldClose = onClick()
                    if (shouldClose) onClose()
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  )
}
