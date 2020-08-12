import React, { useState, useEffect } from 'react'
import deleteFilePng from '../assets/delete-file.png'
import { Prompt } from './Prompt'

export const ProgressPrompt = ({ windowData, onClose }) => {
  const { onComplete, speed = 200 } = windowData
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (progress >= 10) {
        onComplete && onComplete()
        onClose()
      } else {
        setProgress((p) => p + 1)
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [progress, speed, onComplete, onClose])

  return (
    <Prompt
      windowData={{
        ...windowData,
        label: (
          <div className="meter">
            <span style={{ width: `${progress * 10}%` }}></span>
          </div>
        ),
        buttons: [],
        image: deleteFilePng,
        allowClose: false,
      }}
    />
  )
}
