import React from 'react'
import { PathWindow } from '../windows/PathWindow'
import { Prompt } from './Prompt'
import { DrivePropertiesMenu } from './DrivePropertiesMenu'
import { AddProgramsMenu } from './AddProgramsMenu'
import { ProgressPrompt } from './ProgressPrompt'

export const Windows = ({ windows, actions }) => {
  return windows.map((windowData, index) => {
    const isActive = windowData.index === windows[windows.length - 1].index
    const props = {
      // TODO: fix this duplication
      ...windowData,
      ...actions,
      windowData,
      zIndex: index,
      isActive,
      onClose: () => actions.removeWindow(windowData.index),
    }
    if (windowData.type === 'path')
      return <PathWindow key={`window-${windowData.index}`} {...props} />

    if (windowData.type === 'prompt')
      return <Prompt key={`window-${windowData.index}`} {...props} />

    if (windowData.type === 'progress-prompt')
      return <ProgressPrompt key={`window-${windowData.index}`} {...props} />

    if (windowData.type === 'drive-properties')
      return (
        <DrivePropertiesMenu key={`window-${windowData.index}`} {...props} />
      )

    if (windowData.type === 'add-programs')
      return <AddProgramsMenu key={`window-${windowData.index}`} {...props} />

    return null
  })
}
