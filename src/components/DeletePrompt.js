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
  const onDelete = useCallback((paths, onComplete) => {
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
      return true
    })
  }, [])
  const [progress, setProgress] = useState(0)

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
    let timeout = setTimeout(() => {
      if (progress >= 10) {
        removeWindow(index)
        onDelete(paths, onComplete)
      } else {
        setProgress((p) => p + 1)
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [progress, speed, index, paths])

  useEffect(() => {
    let file, file2, file3
    try {
      // TODO: this breaks if you buy only the future ones
      file = fs.readFileSync(`/C:/Program Files/delete-speed-1.txt`)
      file2 = fs.readFileSync(`/C:/Program Files/delete-speed-2.txt`)
      file3 = fs.readFileSync(`/C:/Program Files/delete-speed-3.txt`)
    } catch (e) {}
    let speed = 200
    if (file) speed = 150
    if (file2) speed = 100
    if (file3) speed = 50
    let timeout = setTimeout(() => {
      if (progress === 10) {
        removeWindow(index)
        onDelete(paths, onComplete)
      } else {
        setProgress((p) => p + 1)
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [progress])

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
