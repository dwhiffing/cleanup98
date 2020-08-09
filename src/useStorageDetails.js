import { useState, useEffect } from 'react'
import { getFiles } from './utils/files.js'

export const useStorageDetails = () => {
  const [capacity, setCapacity] = useState(0)
  const [tree, setTree] = useState([])

  useEffect(() => {
    if (tree.length > 0 && !capacity) {
      let _capacity = +localStorage.getItem('capacity')
      if (!_capacity) {
        localStorage.setItem('capacity', tree[0].size)
        _capacity = tree[0].size
      }
      setCapacity(_capacity)
    }
  }, [tree, capacity])

  const updateFiles = () => {
    setTree(getFiles())
  }

  useEffect(updateFiles, [])

  const usedSpace = tree.length > 0 ? tree[0].size : 0
  const freeSpace = capacity - usedSpace

  return { updateFiles, usedSpace, freeSpace, capacity, tree }
}
