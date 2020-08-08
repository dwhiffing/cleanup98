import React from 'react'
import Draggable from 'react-draggable'

export const Icon = ({
  image,
  label,
  onDoubleClick,
  onClick,
  selected,
  className = '',
  textColor = 'black',
}) => {
  const nodeRef = React.useRef(null)
  return (
    <Draggable nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        style={{
          background: selected ? 'blue' : 'transparent',
          margin: 10,
          width: 70,
        }}
      >
        <div
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          className={`icon-button ${className} `}
        >
          <img alt="icon" src={image} />
          <p style={{ color: selected ? 'white' : textColor }}>{label}</p>
        </div>
      </div>
    </Draggable>
  )
}
