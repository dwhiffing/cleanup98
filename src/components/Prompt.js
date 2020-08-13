import React, { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import deleteFilePng from '../assets/delete-file.png'
import { useUpgradeState } from '../utils/useUpgradeState'
import { getDeleteSpeed } from '../utils/useDeletePrompt'

export const Prompt = ({ windowData, onClose }) => {
  const {
    title = '',
    label = '',
    allowClose = true,
    image,
    onClick,
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
              <div>
                <img src={image} alt="logo" className="ml-2 mr-4" />
              </div>
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
  const { onComplete, size } = windowData
  const [progress, setProgress] = useState(0)
  const [upgrades] = useUpgradeState()
  const speed = size ? getDeleteSpeed(upgrades, size) : 200

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
      onClose={onClose}
      windowData={{
        allowClose: false,
        ...windowData,
        label: (
          <div className="flex flex-col">
            <ProgressBarWithDuration
              total={size}
              progress={progress}
              speed={speed}
            />
          </div>
        ),
        buttons: [],
        image: deleteFilePng,
      }}
    />
  )
}

export const ProgressBarWithDuration = ({ progress, speed, total, label }) => {
  const rate = total ? (total / ((speed * 10) / 1000)).toFixed(2) : ''
  return (
    <div className="flex flex-col">
      {label && <p style={{ marginBottom: 8 }}>{label}</p>}
      <ProgressBar progress={progress} />
      <p style={{ marginTop: 8 }}>
        Time remaining: {getDuration(speed * (10 - progress))}
      </p>
      {rate && <p style={{ marginTop: 8 }}>Deleting {rate}KB per second</p>}
    </div>
  )
}

export const ProgressBar = ({ progress, size = 10 }) => {
  return (
    <div className="meter">
      <span style={{ width: `${progress * size}%` }}></span>
    </div>
  )
}

export const getDuration = function (millis) {
  var dur = {}
  var units = [
    { mod: 1000 },
    { label: 'seconds', mod: 60 },
    { label: 'minutes', mod: 60 },
    { label: 'hours', mod: 24 },
    { label: 'days', mod: 31 },
  ]
  units.forEach(function (u) {
    millis = (millis - (dur[u.label] = millis % u.mod)) / u.mod
  })
  return units
    .reverse()
    .filter(function (u) {
      if (!u.label) return false
      return dur[u.label]
    })
    .map(function (u) {
      return (
        dur[u.label] +
        ' ' +
        (dur[u.label] === 1 ? u.label.slice(0, -1) : u.label)
      )
    })
    .join(', ')
}
