import React, { useState, useEffect } from 'react'
import { Prompt, ProgressBar } from './Prompt'
import { deleteFiles } from '../utils/useDeletePrompt'
import { useWindowState } from '../utils/useWindowState'
import deleteFilePng from '../assets/delete-file.png'
import { useFileState } from '../utils/useFileState'

// TODO: needs to force path windows to update
// should move file state to recoil?
export const AutoDeletePrompt = ({ onClose }) => {
  const [windows] = useWindowState()
  const [path, setPath] = useState()
  const { files: _files, removePath } = useFileState()
  const files = _files[path] || []

  const { counter, hasFile } = useAutoDeleter({
    disabled: false,
    files,
    onDelete: (file) => {
      removePath(file.path)
    },
  })

  useEffect(() => {
    const activeWindow = windows[windows.length - 1]
    if (activeWindow && activeWindow.path) {
      setPath(activeWindow.path)
    }
  }, [windows])

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
        allowClose: false,
        width: 300,
      }}
      onClose={onClose}
    />
  )
}

const getSmallestFile = (files) =>
  files.filter((c) => !c.isFolder).sort((a, b) => a.size - b.size)[0]

const useAutoDeleter = ({ disabled, files, onDelete }) => {
  const [counter, setCounter] = useState(0)
  const [smallestFile, setSmallestFile] = useState(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCounter((c) => (smallestFile ? c + 1 : 0))
    }, 200)

    return () => clearTimeout(timeout)
  }, [smallestFile, counter])

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
