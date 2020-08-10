import React, { useState, useEffect } from 'react'
import windowsPng from '../assets/windows-4.png'

export const TaskBar = ({ windows, addWindow, onMinimize }) => {
  return (
    <div>
      <div
        className="window"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
        }}
      >
        <StartButton addWindow={addWindow} />

        {windows
          .concat()
          .sort((a, b) => a.index - b.index)
          .map((w) => (
            <button
              key={`task-bar-${w.index}`}
              className={
                w.index === windows[windows.length - 1].index ? 'active' : ''
              }
              onClick={() => {
                // TODO: if window is active, should minimize
                // if window is minimized, should maximize
                // if window is inactive, should make active
                onMinimize(w)
              }}
            >
              {w.title}
            </button>
          ))}
      </div>
    </div>
  )
}

export const StartButton = ({ addWindow }) => {
  const [startMenu, setStartMenu] = useState({})

  useEffect(() => {
    const listener = document.addEventListener('click', (e) => {
      if (!e.target.classList.contains('start-button')) {
        setStartMenu({ visible: false })
      }
    })
    return () => document.removeEventListener('click', listener)
  }, [])

  return (
    <>
      {startMenu.visible && (
        <div
          style={{
            position: 'absolute',
            left: 3,
            top: -125,
            zIndex: 99,
          }}
        >
          <div className="window" style={{ width: 120, height: 120 }}>
            {startMenu.buttons.map((b) => (
              <button key={`button-${b.text}`} onClick={b.onClick}>
                {b.text}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        className="start-button"
        onClick={() => {
          setStartMenu({
            visible: true,
            buttons: [
              {
                text: 'Add programs',
                onClick: () => addWindow({ type: 'add-programs' }),
              },
              {
                text: 'Disk Properties',
                onClick: () => addWindow({ type: 'drive-properties' }),
              },
            ],
          })
        }}
      >
        <img alt="Start" src={windowsPng} style={{ pointerEvents: 'none' }} />
        Start
      </button>
    </>
  )
}
