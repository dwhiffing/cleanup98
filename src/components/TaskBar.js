import React, { useState, useEffect } from 'react'
import windowsPng from '../assets/windows-4.png'
import { ADD_PROGRAMS_MENU, DRIVE_PROPERTIES_MENU } from '../constants'
import { useWindowState } from '../utils/useWindowState'

export const TaskBar = () => {
  const [windows, actions] = useWindowState()
  return (
    <div>
      <div className="absolute flex window bottom-0 left-0 right-0">
        <StartButton />

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
                actions.onMinimize(w)
              }}
            >
              {w.title}
            </button>
          ))}
      </div>
    </div>
  )
}

export const StartButton = () => {
  const [startMenu, setStartMenu] = useState({})
  const [, actions] = useWindowState()

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
        <div className="absolute z-50" style={{ left: 3, top: -125 }}>
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
                onClick: () => actions.addWindow(ADD_PROGRAMS_MENU),
              },
              {
                text: 'Disk Properties',
                onClick: () => actions.addWindow(DRIVE_PROPERTIES_MENU),
              },
            ],
          })
        }}
      >
        <img alt="Start" className="pointer-events-none" src={windowsPng} />
        Start
      </button>
    </>
  )
}
