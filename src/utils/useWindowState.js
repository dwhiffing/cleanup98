import { useState, useCallback } from 'react'

let windowId = 0

export const useWindowState = () => {
  const [windows, setWindows] = useState([])

  const addWindow = useCallback((window, index = windowId++) => {
    setWindows((windows) => [...windows, { ...window, index }])
    return index
  }, [])

  const removeWindow = useCallback(
    (index) =>
      setWindows((windows) => windows.filter((w) => w.index !== index)),
    [],
  )

  const updateWindow = (index, update) =>
    setWindows((windows) =>
      windows.map((w) => (w.index !== index ? w : { ...w, ...update })),
    )

  const onMinimize = (w) => updateWindow(w.index, { minimized: !w.minimized })
  const onMaximize = (w) => updateWindow(w.index, { maximized: !w.maximized })

  const onActive = (window) => {
    setWindows((windows) =>
      [...windows].sort((a, b) => {
        if (a.index === window.index) return 1
        if (b.index === window.index) return -1
        return 0
      }),
    )
  }

  return { windows, addWindow, removeWindow, onActive, onMinimize, onMaximize }
}

export default useWindowState
