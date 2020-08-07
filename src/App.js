import React, { useState } from 'react'

import computerPng from './assets/computer.png'
import { TaskBar } from './components/TaskBar'
import { Window } from './components/Window'
import { Icon } from './components/Icon'
import './index.css'
import '98.css'

let windowId = 0

function App() {
  const [windows, setWindows] = useState([])

  const addWindow = (window) =>
    setWindows((windows) => [...windows, { ...window, index: windowId++ }])

  const removeWindow = (index) =>
    setWindows((windows) => windows.filter((w) => w.index !== index))

  const updateWindow = (index, update) =>
    setWindows((windows) =>
      windows.map((w) => (w.index !== index ? w : { ...w, ...update }))
    )

  return (
    <div>
      {windows.map((window) => (
        <Window
          key={`window-${window.index}`}
          onMaximize={() =>
            updateWindow(window.index, { maximized: !window.maximized })
          }
          onMinimize={() => updateWindow(window.index, { minimized: true })}
          onClose={() => removeWindow(window.index)}
          {...window}
        >
          {window.children}
        </Window>
      ))}
      <div style={{ position: 'absolute' }}>
        <Icon
          onClick={() =>
            addWindow({ title: 'My Computer', children: <p>Hello world</p> })
          }
          image={computerPng}
          label="My Computer"
        />
      </div>

      <TaskBar
        windows={windows}
        onClickWindowItem={(w) => updateWindow(w.index, { minimized: false })}
      />
    </div>
  )
}

export default App
