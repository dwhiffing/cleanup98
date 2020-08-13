import React, { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import deleteFilePng from '../assets/delete-file.png'

export const Prompt = ({ windowData, onClose }) => {
  const {
    title = '',
    label = '',
    allowClose = true,
    image,
    onClick,
    zIndex = 0,
    width = 400,
    height = 122,
    buttons = [{ text: 'OK', onClick: () => true }],
  } = windowData
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

export const ProgressPrompt = ({ windowData, onClose }) => {
  const { onComplete, speed = 200 } = windowData
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (progress >= 10) {
        onComplete && onComplete()
        onClose()
      } else {
        setProgress((p) => p + 1)
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [progress, speed, onComplete, onClose])

  return (
    <Prompt
      windowData={{
        ...windowData,
        label: <ProgressBar progress={progress} />,
        buttons: [],
        image: deleteFilePng,
        allowClose: false,
      }}
    />
  )
}

export const ProgressBar = ({ progress, size = 10 }) => {
  return (
    <div className="meter">
      <span style={{ width: `${progress * size}%` }}></span>
    </div>
  )
}
