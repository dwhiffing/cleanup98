import React, { useEffect } from 'react'
import { TaskBar } from './components/TaskBar'
import { Item } from './components/Item'
import trashFullPng from './assets/trash-full.png'
import { Windows } from './components/Windows'
import { useIntro } from './utils/useIntro'
import { useClockSettingsPrompt } from './utils/useClockSettingsPrompt'
import ContextMenu from './utils/ContextMenu'
import useWindowState from './components/useWindowState'
import { useStorageDetails } from './useStorageDetails'
import './index.css'
import '98.css'

function App() {
  const { windows, ...windowActions } = useWindowState()
  const { updateFiles, tree, usedSpace } = useStorageDetails(windowActions)
  const actions = { ...windowActions, updateFiles }

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

  useClockSettingsPrompt({ addWindow: actions.addWindow })
  useIntro({
    skip: true,
    addWindow: actions.addWindow,
    onComplete: updateFiles,
  })

  return (
    <div>
      <Windows windows={windows} actions={actions} />

      <div style={{ position: 'absolute' }}>
        {tree.map((item) => (
          <Item
            key={`item-${item.name}`}
            item={item}
            textColor="white"
            {...actions}
          />
        ))}
      </div>

      <ContextMenu
        openProperties={() => {
          updateFiles()
          actions.addWindow({ type: 'drive-properties' })
        }}
      />

      <TaskBar
        windows={windows}
        {...actions}
        onClickWindowItem={(window) => {
          // if window is active, should minimize
          // if window is minimized, should maximize
          // if window is inactive, should make active
          actions.onMinimize(window)
        }}
      />
    </div>
  )
}

export default App
