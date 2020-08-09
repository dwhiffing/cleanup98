import React, { useState, useEffect } from 'react'
import deleteFilePng from '../assets/delete-file.png'
import { Prompt } from './Prompt'

export const ProgressPrompt = ({
  title = '',
  image = deleteFilePng,
  onComplete,
  height,
  onClose,
  speed = 200,
}) => {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let timeout = setTimeout(() => {
      if (progress >= 10) {
        setTimeout(onComplete, 2000)
        onClose()
      } else {
        setProgress((p) => p + 1)
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [progress, speed, onComplete, onClose])
  return (
    <Prompt
      title={title}
      height={height}
      label={
        <div className="meter">
          <span style={{ width: `${progress * 10}%` }}></span>
        </div>
      }
      buttons={[]}
      allowClose={false}
      image={image}
    />
  )
}
