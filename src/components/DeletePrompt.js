import React, { useState, useEffect } from 'react'
import deleteFilePng from '../assets/delete-file.png'
import { Prompt } from './Prompt'

export const DeletePrompt = ({
  index,
  path,
  title = '',
  onDelete,
  removeWindow,
}) => {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let timeout = setTimeout(() => {
      setProgress((p) => p + 1)
      if (progress >= 10) {
        onDelete(path)
        removeWindow(index)
      }
    }, 200)
    return () => clearTimeout(timeout)
  }, [progress, index, onDelete, path, removeWindow])
  return (
    <Prompt
      title={title}
      label={
        <div className="meter">
          <span style={{ width: `${progress * 10}%` }}></span>
        </div>
      }
      allowClose={false}
      image={deleteFilePng}
    />
  )
}
