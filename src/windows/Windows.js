import React from 'react'
import { PathWindow } from '../windows/PathWindow'
import { Prompt } from './Prompt'
import { DrivePropertiesMenu } from './DrivePropertiesMenu'
import { AddProgramsMenu } from './AddProgramsMenu'
import { ProgressPrompt } from './ProgressPrompt'
import { useWindowState } from '../recoil'

export const Windows = () => {
  const [windows, actions] = useWindowState()
  return windows.map((data, index) => {
    const props = {
      windowData: data,
      zIndex: index,
      isActive: data.index === windows[windows.length - 1].index,
      onClose: () => actions.removeWindow(data.index),
    }
    if (data.type === 'path')
      return <PathWindow key={`window-${data.index}`} {...props} />

    if (data.type === 'prompt')
      return <Prompt key={`window-${data.index}`} {...props} />

    if (data.type === 'progress-prompt')
      return <ProgressPrompt key={`window-${data.index}`} {...props} />

    if (data.type === 'drive-properties')
      return <DrivePropertiesMenu key={`window-${data.index}`} {...props} />

    if (data.type === 'add-programs')
      return <AddProgramsMenu key={`window-${data.index}`} {...props} />

    return null
  })
}
