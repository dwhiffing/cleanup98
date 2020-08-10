import React, { useEffect, useCallback, useState } from 'react'
import { TaskBar } from './components/TaskBar'
import trashFullPng from './assets/trash-full.png'
import { Windows } from './components/Windows'
import ContextMenu from './components/ContextMenu'
import { Desktop } from './components/Desktop'
import useWindowState from './utils/useWindowState'
import { useIntro } from './utils/useIntro'
import { useClockSettingsPrompt } from './utils/useClockSettingsPrompt'
import { useStorageDetails } from './utils/useStorageDetails'
import './index.css'
import '98.css'

function App() {
  const [showDesktop, setShowDesktop] = useState(false)
  const { windows, addWindow, ...windowActions } = useWindowState()
  const { tree, usedSpace } = useStorageDetails(windowActions)
  const actions = { addWindow, ...windowActions }
  const openProperties = useCallback(() => {
    actions.addWindow({ type: 'drive-properties' })
  }, [actions])

  useClockSettingsPrompt({ addWindow: actions.addWindow })

  useIntro({
    skip: false,
    addWindow: actions.addWindow,
    onComplete: () => setShowDesktop(true),
  })

  // TODO: make constants for various prompts/windows?

  useEffect(() => {
    if (usedSpace < 0.01) {
      addWindow({
        type: 'prompt',
        image: trashFullPng,
        title: 'Success',
        label: 'You win!',
      })
    }
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
