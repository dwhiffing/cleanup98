import React, { useState, useEffect } from 'react'
import { useWindowState } from '../utils/useWindowState'

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

        if (e.target.classList.contains('drive')) {
          setState({
            visible: true,
            x: e.screenX,
            y: e.screenY - 130,
            buttons: [{ text: 'Properties', onClick: actions.openProperties }],
          })
        }
      },
      false,
    )
  }, [actions.openProperties])

  return (
    <div>
      {state.visible && (
        <div className="absolute z-50" style={{ left: state.x, top: state.y }}>
          <div className="window" style={{ width: 80, height: 200 }}>
            {state.buttons.map((b) => (
              <button key={`button-${b.text}`} onClick={b.onClick}>
                {b.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
