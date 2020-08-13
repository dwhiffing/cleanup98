import { useState, useEffect } from 'react'
import { getFileSizeForPath } from './fileSystem'

export const useStorageDetails = () => {
  const [capacity, setCapacity] = useState(100)
  const [usedSpace, setUsedSpace] = useState(100)

  // TODO (PERF): this should be rewritten to determine capacity once
  // and only set usedSpace one via getFileSizeForPath
  // afterwards, it should change the cached value directly
  // for each deleted file
  useEffect(() => {
    getFileSizeForPath('/').then((size) => {
      let _capacity = +localStorage.getItem('capacity')
      if (!_capacity) {
        localStorage.setItem('capacity', size)
        _capacity = size
      }
      setCapacity(_capacity)
      setUsedSpace(size)
    })
  })

  const freeSpace = capacity - usedSpace

  return { usedSpace, freeSpace, capacity }
}
