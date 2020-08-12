import { useEffect, useRef } from 'react'
import timePng from '../assets/time.png'
import { useWindowState } from '../utils/useWindowState'

export const useClockSettingsPrompt = () => {
  const [, actions] = useWindowState()
  const clockSettingsRef = useRef()
  useEffect(() => {
    const interval = setInterval(() => {
      if (clockSettingsRef.current) return
      clockSettingsRef.current = true
      actions.addWindow({
        type: 'prompt',
        key: 'clock-settings',
        title: 'New Clock settings',
        label:
          'Windows has updated your clock settings as a result of Daylight Savings Time. Please verify that your new clock settings are correct.',
        image: timePng,
        buttons: [
          {
            text: 'OK',
            onClick: () => {
              clockSettingsRef.current = false
              return true
            },
          },
        ],
      })
      return () => clearInterval(interval)
    }, 60000)
    //eslint-disable-next-line
  }, [])
}
