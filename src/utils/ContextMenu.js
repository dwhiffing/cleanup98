import React, { useState, useEffect } from 'react'

const ContextMenu = ({ openProperties }) => {
  const [contextMenu, setContextMenu] = useState(false)

  useEffect(() => {
    document.addEventListener(
      'contextmenu',
      function (e) {
        e.preventDefault()

        const listener = document.addEventListener('click', () => {
          setTimeout(() => {
            setContextMenu({ visible: false })
          }, 100)
          document.removeEventListener('click', listener)
        })

        if (e.target.classList.contains('drive')) {
          setContextMenu({
            visible: true,
            x: e.screenX,
            y: e.screenY - 130,
            buttons: [
              {
                text: 'Properties',
                onClick: openProperties,
              },
            ],
          })
        }
      },
      false,
    )
  }, [openProperties])

  return (
    <div>
      {contextMenu.visible && (
        <div
          style={{
            position: 'absolute',
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 99,
          }}
        >
          <div className="window" style={{ width: 80, height: 200 }}>
            {contextMenu.buttons.map((b) => (
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

export default ContextMenu
