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
    let file
    try {
      file = fs.readFileSync(`/C:/Program Files/delete-speed.txt`)
    } catch (e) {}
    let timeout = setTimeout(
      () => {
        if (progress >= 10) {
          removeWindow(index)
          onDelete(paths, onComplete)
        } else {
          setProgress((p) => p + 1)
        }
      },
      file ? +file.toString() : 200,
    )
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
