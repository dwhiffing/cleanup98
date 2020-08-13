import React, { useState, useEffect } from 'react'
import { Prompt, ProgressBar } from './Prompt'
import { deleteFiles, getDeleteSpeed } from '../utils/useDeletePrompt'
import errorPng from '../assets/error.png'
import { useWindowState } from '../utils/useWindowState'
import deleteFilePng from '../assets/delete-file.png'
import { useFileState } from '../utils/useFileState'
import { useUpgradeState } from '../utils/useUpgradeState'

// TODO: figure out upgrades/interface
// limit to one open at a time
// should display estimated time to delete
// should display filename being deleted
export const AutoDeletePrompt = ({ onClose }) => {
  const [windows] = useWindowState()
  const [upgrades, , forceUpdate] = useUpgradeState()
  const [path, setPath] = useState()
  const { files: _files, removePath } = useFileState()
  const files = _files[path] || []

  const { counter, hasFile } = useAutoDeleter({
    disabled: false,
    files,
    onDelete: (file) => {
      forceUpdate()
      removePath(file.path)
    },
  })

  useEffect(() => {
    const activeWindow = windows[windows.length - 1]
    if (activeWindow && activeWindow.path) {
      setPath(activeWindow.path)
    }
  }, [windows])

  if (!upgrades.includes('autodeleter')) {
    return (
      <Prompt
        progress={counter}
        windowData={{
          title: 'Unknown error',
          image: errorPng,
          label: 'AutoDeleter was corrupted',
        }}
        onClose={onClose}
      />
    )
  }

  return (
    <Prompt
      progress={counter}
      windowData={{
        title: 'AutoDelete',
        image: deleteFilePng,
        label: hasFile ? (
          <ProgressBar progress={counter} />
        ) : (
          'No files to delete'
        ),
        buttons: [],
        width: 300,
      }}
      onClose={onClose}
    />
  )
}

const getSmallestFile = (files) =>
  files.filter((c) => !c.isFolder).sort((a, b) => a.size - b.size)[0]

const useAutoDeleter = ({ disabled, files, onDelete }) => {
  const [upgrades] = useUpgradeState()
  const [counter, setCounter] = useState(0)
  const [smallestFile, setSmallestFile] = useState(null)

  useEffect(() => {
    if (!smallestFile) return
    const timeout = setTimeout(() => {
      setCounter((c) => (smallestFile ? c + 1 : 0))
    }, getDeleteSpeed(upgrades, smallestFile.size))

    return () => clearTimeout(timeout)
  }, [smallestFile, upgrades, counter])

  useEffect(() => {
    if (counter < 10 || !smallestFile) return

    deleteFiles([smallestFile.path], () => {
      onDelete(smallestFile)
      setSmallestFile(null)
      setCounter(0)
    })
  }, [counter, smallestFile, onDelete])

  useEffect(() => {
    const smallest = getSmallestFile(files)
    setSmallestFile(smallest)
    if (smallest) {
      setCounter(0)
    }
  }, [files])

  return { counter, hasFile: !!smallestFile }
}
