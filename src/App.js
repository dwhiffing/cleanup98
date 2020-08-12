import React, { useEffect, useState } from 'react'
import { TaskBar } from './components/TaskBar'
import { ContextMenu } from './components/ContextMenu'
import { Desktop } from './components/Desktop'
import { Windows } from './windows/Windows'
import { useWindowState } from './utils/recoil'
import { useIntroPrompts } from './utils/useIntroPrompts'
import { useClockSettingsPrompt } from './utils/useClockSettingsPrompt'
import { useStorageDetails } from './utils/useStorageDetails'
import { WIN_PROMPT } from './constants'
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
      <Desktop shouldRender={showDesktop} />

      <Windows />

      <ContextMenu />

      <TaskBar />
    </div>
  )
}

export default App
