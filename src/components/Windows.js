import React from 'react'
import { PathWindow } from './PathWindow'
import { Prompt } from './Prompt'
import { DrivePropertiesMenu } from './DrivePropertiesMenu'
import { AddProgramsMenu } from './AddProgramsMenu'
import { ProgressPrompt } from './ProgressPrompt'

export const Windows = ({ windows, actions }) => {
  return windows.map((window, index) => {
    const isActive = window.index === windows[windows.length - 1].index
    const props = {
      // TODO: fix this duplication
      ...window,
      ...actions,
      window,
      zIndex: index,
      isActive,
      onClose: () => actions.removeWindow(window.index),
    }
    if (window.type === 'path')
      return <PathWindow key={`window-${window.index}`} {...props} />

    if (window.type === 'prompt')
      return <Prompt key={`window-${window.index}`} {...props} />

    if (window.type === 'progress-prompt')
      return <ProgressPrompt key={`window-${window.index}`} {...props} />

    if (window.type === 'drive-properties')
      return <DrivePropertiesMenu key={`window-${window.index}`} {...props} />

    if (window.type === 'add-programs')
      return <AddProgramsMenu key={`window-${window.index}`} {...props} />

    return null
  })
}
