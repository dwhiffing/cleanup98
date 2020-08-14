import { useEffect, useRef } from 'react'
import trashFullPng from '../assets/trash-full.png'
import { useWindowState } from '../utils/useWindowState'
import { HELP_PROMPT } from '../constants'
import useSound from 'use-sound'
import boopSfx from '../assets/startup.mp3'
export const useIntroPrompts = ({ onComplete, skip }) => {
  const [, actions] = useWindowState()
  const open = useRef(false)
  const [play, data] = useSound(boopSfx)
  useEffect(() => {
    if (open.current || !data.duration) return
    if (skip || localStorage.getItem('seen-intro')) {
      onComplete && onComplete()
      return
    }
    open.current = true
    actions.addWindow({
      type: 'prompt',
      image: trashFullPng,
      allowClose: false,
      height: 130,
      sound: 'ding',
      title: 'Hard Disk is Full',
      label:
        'You have run out of space on drive C.\n\nTo free space on this drive by deleting old or unnecessary files, click Disk Cleanup.',
      buttons: [
        {
          text: 'Disk Cleanup',
          onClick: () => {
            actions.addWindow({
              type: 'progress-prompt',
              title: 'Running Disk Cleanup...',
              image: trashFullPng,
              allowClose: false,
              onComplete: () => {
                actions.addWindow({
                  ...HELP_PROMPT,
                  sound: 'boop',
                  buttons: [
                    {
                      text: 'OK',
                      onClick: () => {
                        play()
                        localStorage.setItem('seen-intro', 'true')
                        onComplete && onComplete()
                        return true
                      },
                    },
                  ],
                })
                return true
              },
            })
            return true
          },
        },
      ],
    })
    // eslint-disable-next-line
  }, [data.duration])
}
