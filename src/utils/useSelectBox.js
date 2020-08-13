import { useState, useEffect, useRef } from 'react'
import Selection from '@simonwep/selection-js'

//TODO: fix visible box being offset when window is scrollable
export const useSelectBox = ({
  start = {},
  disabled,
  containerClass = '.drag-window',
  selectableClass = '.drag-window .icon-button',
}) => {
  const selectionRef = useRef()
  const selectingRef = useRef()
  const coordsRef = useRef({ x: start.x || 0, y: start.y || 0 })
  const [selected, setSelected] = useState([])

  useEffect(() => {
    if (disabled) {
      selectionRef.current && selectionRef.current.destroy()
      return
    }

    selectionRef.current = new Selection({
      class: 'selection',
      mode: 'center',
      singleClick: false,
      selectionAreaContainer: containerClass,
      selectables: [selectableClass],
      boundaries: [containerClass],
      startareas: [containerClass],
    })

    selectionRef.current.on('start', (evt) => {
      selectingRef.current = true
    })

    selectionRef.current.on('move', ({ selected, area, ...rest }) => {
      area.style.marginLeft = `-${coordsRef.current.x}px`
      area.style.marginTop = `-${coordsRef.current.y}px`
      const selectedFilenames = selected.map((c) => c.innerText.split('\n')[0])
      setSelected((s) => selectedFilenames)
    })

    selectionRef.current.on('stop', (evt) => {
      setTimeout(() => {
        selectingRef.current = false
      }, 100)
    })

    let selection = selectionRef.current

    return () => {
      if (selection) selection.destroy()
    }
  }, [disabled, containerClass, selectableClass])

  return [selected, setSelected, coordsRef, selectingRef]
}
