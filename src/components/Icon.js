import React from 'react'
import Draggable from 'react-draggable'

export const Icon = ({
  addWindow,
  item,
  textColor,
  selected,
  onClick,
  onDoubleClick,
}) => {
  return (
    <IconBase
      type="folder"
      label={`${item.name}\n${
        item.size && !item.name.match(/My Computer|C:/)
          ? `${item.size.toFixed(4)}KB`
          : ''
      }`}
      image={item.image}
      className={item.name === 'C:' ? 'drive' : ''}
      textColor={textColor}
      selected={selected}
      onClick={onClick}
      onDoubleClick={() => {
        addWindow({
          type: 'path',
          title: item.name,
          path: item.path,
        })
        onDoubleClick && onDoubleClick()
      }}
    />
  )
}

const IconBase = ({
  image,
  label,
  onDoubleClick,
  onClick,
  selected,
  className = '',
  textColor = 'black',
}) => {
  const nodeRef = React.useRef(null)
  // TODO: add more file images based on extenion
  // txt, bat, exe

  return (
    <Draggable nodeRef={nodeRef}>
      <div
        className="icon-item"
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
