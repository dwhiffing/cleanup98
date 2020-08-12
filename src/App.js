import React, { useEffect, useCallback, useState } from 'react'
import { TaskBar } from './components/TaskBar'
import { Windows } from './components/Windows'
import ContextMenu from './components/ContextMenu'
import { Desktop } from './components/Desktop'
import useWindowState from './utils/useWindowState'
import { useIntro } from './utils/useIntro'
import { useClockSettingsPrompt } from './utils/useClockSettingsPrompt'
import { useStorageDetails } from './utils/useStorageDetails'
import './tailwind.output.css'
import '98.css'
import { WIN_PROMPT } from './constants'
import { useRecoilState } from 'recoil'
import { upgradeState } from './utils/recoil'
import { getUpgrades } from './utils'

function App() {
  const [showDesktop, setShowDesktop] = useState(false)
  const [upgrades, setUpgrades] = useRecoilState(upgradeState)
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

  useEffect(() => {
    if (usedSpace < 0.01) addWindow(WIN_PROMPT)
  }, [addWindow, usedSpace])

  useEffect(() => {
    getUpgrades().then(setUpgrades)
  }, [setUpgrades])

  console.log(upgrades)

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
