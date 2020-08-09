import React, { useState, useEffect } from 'react'
import windowsPng from '../assets/windows-4.png'

export const TaskBar = ({ windows, addWindow, updateFiles, onMinimize }) => {
  const [startMenu, setStartMenu] = useState({})

  useEffect(() => {
    const listener = document.addEventListener('click', (e) => {
      if (!e.target.classList.contains('start-button')) {
        setStartMenu({ visible: false })
      }
      return () => document.removeEventListener('click', listener)
    })
  }, [])

  return (
    <div>
      {startMenu.visible && (
        <div
          style={{
            position: 'absolute',
            left: startMenu.x,
            top: startMenu.y,
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
        <button
          onClick={() =>
            setStartMenu({
              visible: true,
              x: 3,
              y: window.innerHeight - 155,
              buttons: [
                {
                  text: 'Add programs',
                  onClick: () => {
                    updateFiles()
                    addWindow({ type: 'add-programs' })
                  },
                },
                {
                  text: 'Disk Properties',
                  onClick: () => {
                    updateFiles()
                    addWindow({ type: 'drive-properties' })
                  },
                },
              ],
            })
          }
          className="start-button"
        >
          <img alt="Start" src={windowsPng} />
          Start
        </button>
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
