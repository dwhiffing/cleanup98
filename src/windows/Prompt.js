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
      <div ref={nodeRef} onClick={onClick} className="prompt-wrap">
        <div className="window" style={{ width, height }}>
          <div className="title-bar">
            <div className="title-bar-text">{title}</div>
            <div className="title-bar-controls">
              {allowClose && (
                <button aria-label="Close" onClick={onClose}></button>
              )}
            </div>
          </div>
          <div className="window-body">
            <div className="flex text-center py-2" style={{ lineHeight: 1.4 }}>
              <img src={image} alt="logo" className="ml-2 mr-4" />
              {label}
            </div>

            <div className="flex">
              {buttons.map(({ onClick, text }) => (
                <button
                  key={`button-${text}`}
                  onClick={() => onClick() && onClose()}
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
