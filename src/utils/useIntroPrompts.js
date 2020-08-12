import { useEffect } from 'react'
import errorPng from '../assets/error.png'
import trashFullPng from '../assets/trash-full.png'
import { useWindowState } from '../utils/useWindowState'

export const useIntroPrompts = ({ onComplete, skip }) => {
  const [, actions] = useWindowState()
  useEffect(() => {
    if (skip || localStorage.getItem('seen-intro')) {
      onComplete && onComplete()
      return
    }
    actions.addWindow({
      type: 'prompt',
      image: trashFullPng,
      allowClose: false,
      height: 130,
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
                  type: 'prompt',
                  image: errorPng,
                  title: 'Windows has encountered an error',
                  label:
                    'Disk Cleanup Utility not found.  Please remove all files from this computer manually by clicking on them and pressing delete.',
                  buttons: [
                    {
                      text: 'OK',
                      onClick: () => {
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
  }, [])
}
