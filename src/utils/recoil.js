import { atom, useRecoilState } from 'recoil'
import { useEffect, useCallback } from 'react'
import { getUpgrades } from './fileSystem'

export const upgradeState = atom({
  key: 'upgradeState',
  default: [],
})

export const windowState = atom({
  key: 'windowState',
  default: [],
})

export const useUpgradeState = () => {
  const [upgrades, setUpgrades] = useRecoilState(upgradeState)
  useEffect(() => {
    getUpgrades().then(setUpgrades)
  }, [setUpgrades])
  return [upgrades, setUpgrades]
}

let windowId = 0
export const useWindowState = () => {
  const [windows, setWindows] = useRecoilState(windowState)

  const addWindow = useCallback(
    (windowData, index = windowId++) => {
      setWindows((windows) => [...windows, { ...windowData, index }])
      return index
    },
    [setWindows],
  )

  const removeWindow = useCallback(
    (index) =>
      setWindows((windows) => windows.filter((w) => w.index !== index)),
    [setWindows],
  )

  const updateWindow = (index, update) =>
    setWindows((windows) =>
      windows.map((w) => (w.index !== index ? w : { ...w, ...update })),
    )

  const onActive = (windowData) => {
    setWindows((windows) =>
      [...windows].sort((a, b) => {
        if (a.index === windowData.index) return 1
        if (b.index === windowData.index) return -1
        return 0
      }),
    )
  }

  const onMinimize = (w) => updateWindow(w.index, { minimized: !w.minimized })
  const onMaximize = (w) => updateWindow(w.index, { maximized: !w.maximized })

  const openProperties = useCallback(() => {
    addWindow({ type: 'drive-properties' })
  }, [addWindow])

  const actions = {
    windows,
    addWindow,
    removeWindow,
    onActive,
    onMinimize,
    onMaximize,
    openProperties,
  }

  return [windows, actions]
}
