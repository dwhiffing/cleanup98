import React from 'react'
import Draggable from 'react-draggable'

export const Icon = ({ image, label, onClick, textColor = 'black' }) => {
  const nodeRef = React.useRef(null)
  return (
    <Draggable nodeRef={nodeRef}>
      <div ref={nodeRef} style={{ margin: 10, width: 70 }}>
        <div onDoubleClick={onClick} className="icon-button">
          <img alt="icon" src={image} />
          <p style={{ color: textColor }}>{label}</p>
        </div>
      </div>
    </Draggable>
  )
}
