import { useState, useEffect } from 'react'
import { useFileState } from './useFileState'

export const useStorageDetails = () => {
  const [capacity, setCapacity] = useState(100)
  const [usedSpace, setUsedSpace] = useState(100)
  const { files, updatePath } = useFileState()

  useEffect(() => {
    updatePath('/')
  }, [])

  useEffect(() => {
    const size = files && files['/'] && files['/'][0].size
    let _capacity = +localStorage.getItem('capacity')
    if (!_capacity) {
      localStorage.setItem('capacity', size)
      _capacity = size
    }
    setCapacity(_capacity)
    setUsedSpace(size)
    // eslint-disable-next-line
  }, [files])

  const freeSpace = capacity - usedSpace

  return { usedSpace, freeSpace, capacity }
}
