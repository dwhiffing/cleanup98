import React, { useEffect, useCallback } from 'react'
import { TaskBar } from './components/TaskBar'
import trashFullPng from './assets/trash-full.png'
import { Windows } from './components/Windows'
import ContextMenu from './components/ContextMenu'
import useWindowState from './utils/useWindowState'
import { useIntro } from './utils/useIntro'
import { useClockSettingsPrompt } from './utils/useClockSettingsPrompt'
import { useStorageDetails } from './utils/useStorageDetails'
import './index.css'
import '98.css'
import { Desktop } from './components/Desktop'

function App() {
  const { windows, ...windowActions } = useWindowState()
  const { updateFiles, tree, usedSpace } = useStorageDetails(windowActions)
  const actions = { ...windowActions, updateFiles }
  const openProperties = useCallback(() => {
    actions.updateFiles()
    actions.addWindow({ type: 'drive-properties' })
  }, [actions])

  useClockSettingsPrompt({ addWindow: actions.addWindow })

  useIntro({
    skip: true,
    addWindow: actions.addWindow,
    onComplete: updateFiles,
  })

  useEffect(() => {
    if (tree.length > 0 && usedSpace < 0.01) {
      actions.addWindow({
        type: 'prompt',
        image: trashFullPng,
        title: 'Success',
        label: 'You win!',
      })
    }
  }, [tree, actions, usedSpace])

  return (
    <div>
      <Windows windows={windows} actions={actions} />

      <Desktop tree={tree} actions={actions} />

      <ContextMenu openProperties={openProperties} />

      <TaskBar windows={windows} {...actions} />
    </div>
  )
}

export default App
