import React, { useState, useEffect } from 'react'

export const ContextMenu = ({ openProperties }) => {
  const [state, setState] = useState(false)

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
            buttons: [{ text: 'Properties', onClick: openProperties }],
          })
        }
      },
      false,
    )
  }, [openProperties])

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
