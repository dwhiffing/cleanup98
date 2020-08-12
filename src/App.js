import React, { useEffect, useState } from 'react'
import { TaskBar } from './components/TaskBar'
import { ContextMenu } from './components/ContextMenu'
import { Windows } from './components/Windows'
import { Icon } from './components/Icon'
import { useWindowState } from './utils/useWindowState'
import { useIntroPrompts } from './utils/useIntroPrompts'
import { useClockSettingsPrompt } from './utils/useClockSettingsPrompt'
import { useStorageDetails } from './utils/useStorageDetails'
import { WIN_PROMPT, DESKTOP_ICONS } from './constants'
import './tailwind.output.css'
import '98.css'

function App() {
  const [showDesktop, setShowDesktop] = useState(false)
  const [, windowActions] = useWindowState()
  const { usedSpace } = useStorageDetails(windowActions)

  useIntroPrompts({ onComplete: () => setShowDesktop(true) })

  useClockSettingsPrompt()

  useEffect(() => {
    if (usedSpace < 0.01) windowActions.addWindow(WIN_PROMPT)
  }, [windowActions, usedSpace])

  return (
    <div>
      {showDesktop && (
        <div className="absolute">
          {DESKTOP_ICONS.map((item) => (
            <Icon key={`item-${item.name}`} item={item} textColor="white" />
          ))}
        </div>
      )}
      <Windows />
      <ContextMenu />
      <TaskBar />
    </div>
  )
}

export default App
