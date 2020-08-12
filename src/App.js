import React, { useEffect, useCallback, useState } from 'react'
import { TaskBar } from './components/TaskBar'
import { ContextMenu } from './components/ContextMenu'
import { Desktop } from './components/Desktop'
import { Windows } from './windows/Windows'
import { useWindowState } from './utils/useWindowState'
import { useIntroPrompts } from './utils/useIntroPrompts'
import { useClockSettingsPrompt } from './utils/useClockSettingsPrompt'
import { useStorageDetails } from './utils/useStorageDetails'
import { WIN_PROMPT } from './constants'
import './tailwind.output.css'
import '98.css'

function App() {
  const [showDesktop, setShowDesktop] = useState(false)
  const { windows, addWindow, ...windowActions } = useWindowState()
  const { tree, usedSpace } = useStorageDetails(windowActions)
  const actions = { addWindow, ...windowActions }
  const openProperties = useCallback(() => {
    actions.addWindow({ type: 'drive-properties' })
  }, [actions])

  useIntroPrompts({ addWindow, onComplete: () => setShowDesktop(true) })

  useClockSettingsPrompt({ addWindow: actions.addWindow })

  useEffect(() => {
    if (usedSpace < 0.01) addWindow(WIN_PROMPT)
  }, [addWindow, usedSpace])

  return (
    <div>
      <Desktop shouldRender={showDesktop} tree={tree} actions={actions} />

      <Windows windows={windows} actions={actions} />

      <ContextMenu openProperties={openProperties} />

      <TaskBar windows={windows} {...actions} />
    </div>
  )
}

export default App
