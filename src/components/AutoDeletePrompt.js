import React, { useState, useEffect } from 'react'
import { Prompt, ProgressBarWithDuration } from './Prompt'
import { deleteFiles, getDeleteSpeed } from '../utils/useDeletePrompt'
import errorPng from '../assets/error.png'
import { useWindowState } from '../utils/useWindowState'
import deleteFilePng from '../assets/delete-file.png'
import { useFileState } from '../utils/useFileState'
import { useUpgradeState } from '../utils/useUpgradeState'

export const AutoDeletePrompt = ({ onClose }) => {
  const [windows] = useWindowState()
  const [upgrades, forceUpdate] = useUpgradeState()
  const [path, setPath] = useState()
  const [isLocked, setIsLocked] = useState(false)
  const { files: _files, removePath } = useFileState()
  const files = _files[path] || []

  const { deleteSpeed, loadingSpeed, counter, file } = useAutoDeleter({
    disabled: false,
    files,
    onDelete: (file) => {
      forceUpdate()
      removePath(file.path)
    },
  })

  useEffect(() => {
    if (isLocked) return

    const activeWindow = windows[windows.length - 1]
    if (activeWindow && activeWindow.path) {
      setPath(activeWindow.path)
    }
  }, [windows, isLocked])

  if (!upgrades.autodeleter) {
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
  const smallest = getSmallestFile(files)

  return (
    <Prompt
      progress={counter}
      windowData={{
        title: 'AutoDelete',
        image: deleteFilePng,
        index: 0,
        label: file ? (
          <ProgressBarWithDuration
            label={`Deleting ${file.name}`}
            progress={counter}
            total={file && file.size}
            speed={deleteSpeed}
          />
        ) : smallest ? (
          <ProgressBarWithDuration
            label={`searching for file in ${path}`}
            progress={counter}
            speed={loadingSpeed}
          />
        ) : (
          'No files to delete. Focus a window with available files to get started.'
        ),
        buttons: [
          {
            text: isLocked ? 'Unlock' : 'Lock to window',
            onClick: () => setIsLocked((l) => !l),
            hotkeyDisabled: true,
          },
        ],
        height: 170,
        width: 300,
      }}
      onClose={onClose}
    />
  )
}

const getSmallestFile = (files) =>
  files &&
  files.filter &&
  files.filter((c) => !c.isFolder).sort((a, b) => a.size - b.size)[0]

const useAutoDeleter = ({ disabled, files, onDelete }) => {
  const [upgrades] = useUpgradeState()
  const [counter, setCounter] = useState(0)
  const [deleteSpeed, setDeleteSpeed] = useState(1000)
  const [loadingSpeed, setLoadingSpeed] = useState(1000)
  const [smallestFile, setSmallestFile] = useState(null)

  // update the delete speed based on the smallest file
  useEffect(() => {
    if (!smallestFile) return
    setDeleteSpeed(getDeleteSpeed(upgrades, smallestFile.size))
  }, [upgrades, smallestFile])

  // update the delete speed based on the smallest file
  useEffect(() => {
    setLoadingSpeed(1000 - upgrades['autodeleter-speed'] * 200)
  }, [upgrades])

  // update the counters
  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setCounter((c) => (c < 10 ? c + 1 : c))
      },
      smallestFile ? deleteSpeed : loadingSpeed,
    )

    return () => clearTimeout(timeout)
  }, [upgrades, smallestFile, counter, loadingSpeed, deleteSpeed])

  // delete the file if counter is 10 and one is available
  useEffect(() => {
    if (counter < 10) return
    if (!smallestFile) {
      const smallest = getSmallestFile(files)
      setSmallestFile(smallest)
      if (smallest) {
        setCounter(0)
      }
      return
    }
    deleteFiles([smallestFile.path], () => {
      onDelete(smallestFile)
      setCounter(0)
      setSmallestFile(null)
    })
  }, [counter, files, smallestFile, onDelete])

  useEffect(() => {
    // setCounter(0)
  }, [files])

  return { counter, loadingSpeed, deleteSpeed, file: smallestFile }
}
