import React, { useState, useEffect } from 'react'
import deleteFilePng from '../assets/delete-file.png'
import { Prompt } from './Prompt'
import { fs } from '../utils/files'

export const DeletePrompt = ({
  index,
  paths,
  title = '',
  image = deleteFilePng,
  onComplete,
  onDelete,
  removeWindow,
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let file, file2, file3
    try {
      file = fs.readFileSync(`/C:/Program Files/delete-speed-1.txt`)
      file2 = fs.readFileSync(`/C:/Program Files/delete-speed-2.txt`)
      file3 = fs.readFileSync(`/C:/Program Files/delete-speed-3.txt`)
    } catch (e) {}
    let speed = 200
    if (file) speed = 150
    if (file2) speed = 100
    if (file3) speed = 50
    let timeout = setTimeout(() => {
      if (progress >= 10) {
        removeWindow(index)
        onDelete(paths, onComplete)
      } else {
        setProgress((p) => p + 1)
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [progress, onComplete, index, onDelete, paths, removeWindow])
  return (
    <Prompt
      title={title}
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
