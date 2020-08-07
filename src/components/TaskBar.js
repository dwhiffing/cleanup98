import React from 'react'
import windowsPng from '../assets/windows-4.png'

export const TaskBar = ({ windows, onClickWindowItem }) => (
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
    <button className="start-button">
      <img alt="Start" src={windowsPng} />
      Start
    </button>
    {windows.map((w) => (
      <button key={`task-bar-${w.index}`} onClick={() => onClickWindowItem(w)}>
        {w.title}
      </button>
    ))}
  </div>
)
