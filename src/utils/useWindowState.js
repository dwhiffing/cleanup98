import { atom, useRecoilState } from 'recoil'
import { useCallback } from 'react'
import { DRIVE_PROPERTIES_MENU, ERROR_PROMPT } from '../constants'
import { useUpgradeState } from './useUpgradeState'

export const windowState = atom({
  key: 'windowState',
  default: [],
})

let windowId = 0
export const useWindowState = () => {
  const [windows, setWindows] = useRecoilState(windowState)
  const [upgrades] = useUpgradeState()

  const addWindow = useCallback(
    (windowData, index = windowId++) => {
      setWindows((windows) => {
        if (
          windowData.type === 'auto-delete-prompt' &&
          windows.filter((w) => w.type === 'auto-delete-prompt').length >=
            upgrades.autodeleter
        ) {
          return [
            ...windows,
            { ...ERROR_PROMPT, label: 'Autodeleter already open', index },
          ]
        }

        return [...windows, { ...windowData, index }]
      })
      return index
    },
    [setWindows, upgrades],
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
    addWindow(DRIVE_PROPERTIES_MENU)
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
