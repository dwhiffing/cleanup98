import React, { useState, useEffect } from 'react'
import { useWindowState } from '../utils/useWindowState'
import { HoverMenu } from '../components/TaskBar'

export const ContextMenu = () => {
  const [state, setState] = useState(false)
  const [, actions] = useWindowState()

  useEffect(() => {
    document.addEventListener(
      'contextmenu',
      function (e) {
        e.preventDefault()

        const listener = document.addEventListener('click', () => {
          setTimeout(() => setState({ visible: false }), 100)
          document.removeEventListener('click', listener)
        })

        // if (e.target.classList.contains('drive')) {
        // TODO: how to get clicked path?
        setState({
          visible: true,
          x: e.screenX,
          y: e.screenY - 130,
          buttons: [
            { text: 'Open' },
            { text: 'Create Shortcut' },
            { text: 'Delete' },
            { text: 'Rename' },
            { text: 'Properties', onClick: actions.openProperties },
          ],
        })
        // }
      },
      false,
    )
  }, [actions.openProperties])

  return (
    <div>
      {state.visible && (
        <div
          className="absolute z-50"
          style={{ left: state.x, top: state.y, width: 120 }}
        >
          <HoverMenu buttons={state.buttons} />
        </div>
      )}
    </div>
  )
}
