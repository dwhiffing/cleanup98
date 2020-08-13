import React from 'react'
import { PathWindow } from '../components/PathWindow'
import { DrivePropertiesMenu } from './DrivePropertiesMenu'
import { AddProgramsMenu } from './AddProgramsMenu'
import { Prompt, ProgressPrompt } from './Prompt'
import { useWindowState } from '../utils/useWindowState'
import { AutoDeletePrompt } from './AutoDeletePrompt'

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

    if (data.type === 'auto-delete-prompt')
      return <AutoDeletePrompt key={`window-${data.index}`} {...props} />

    if (data.type === 'drive-properties')
      return <DrivePropertiesMenu key={`window-${data.index}`} {...props} />

    if (data.type === 'add-programs')
      return <AddProgramsMenu key={`window-${data.index}`} {...props} />

    return null
  })
}
