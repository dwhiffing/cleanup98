import { useEffect, useRef } from 'react'
import timePng from '../assets/time.png'
import { useWindowState } from '../recoil'

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
        label:
          'Windows has updated your clock settings as a result of Daylight Savings Time. Please verify that your new clock settings are correct.',
      })
      return () => clearInterval(interval)
    }, 60000)
    //eslint-disable-next-line
  }, [])
}
