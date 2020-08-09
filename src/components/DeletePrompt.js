import React, { useState, useEffect, useCallback } from 'react'
import deleteFilePng from '../assets/delete-file.png'
import errorPng from '../assets/error.png'
import { Prompt } from './Prompt'
import { fs } from '../utils/files'
import { deletePaths, getUpgrade } from '../utils'

export const DeletePrompt = ({
  index,
  paths,
  title = '',
  image = deleteFilePng,
  onComplete,
  addWindow,
  removeWindow,
}) => {
  const [speed, setSpeed] = useState(0)
  const [progress, setProgress] = useState(0)

  const onDelete = useCallback(() => {
    deletePaths(paths, onComplete, () => {
      const stats = paths.map((path) => fs.statSync(path))
      const canDeleteFolder = getUpgrade('delete-folders')
      if (stats.some((stat) => stat.isDirectory()) && !canDeleteFolder) {
        addWindow({
          type: 'prompt',
          image: errorPng,
          title: 'Administrator',
          label: "You don't have permission to delete this folder.",
        })
        return false
      }
      removeWindow(index)

      return true
    })
  }, [addWindow, removeWindow, index, paths, onComplete])

  useEffect(() => {
    const file = getUpgrade('delete-speed-1')
    const file2 = getUpgrade('delete-speed-2')
    const file3 = getUpgrade('delete-speed-3')
    let newSpeed = 200
    if (file) newSpeed = 150
    if (file2) newSpeed = 100
    if (file3) newSpeed = 50
    setSpeed(newSpeed)
  }, [])

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 10) return onDelete()
        return p + 1
      })
    }, speed)
    return () => clearInterval(interval)
  }, [speed, onDelete])

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
