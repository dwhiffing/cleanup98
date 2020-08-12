import React from 'react'

const Window = ({
  windowData,
  children,
  isActive,
  onMinimize,
  onMaximize,
  onClose,
}) => {
  return (
    <div className={`window w-full h-full flex flex-col`}>
      <div className="title-bar">
        <div className="title-bar-text">
          {windowData.title || windowData.path || ''}
        </div>
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
  )
}

export default Window
