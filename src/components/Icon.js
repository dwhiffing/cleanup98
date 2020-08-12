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
  const { name, size } = item
  return (
    <IconBase
      type="folder"
      label={name}
      size={!name.match(/My Computer|C:/) ? `${size.toFixed(4)}KB` : ''}
      image={item.image}
      className={item.name === 'C:' ? 'drive' : ''}
      textColor={textColor}
      selected={selected}
      onClick={onClick}
      onDoubleClick={() => {
        addWindow({ type: 'path', title: item.name, path: item.path })
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
  size,
  className = '',
  textColor = 'black',
}) => {
  const nodeRef = React.useRef(null)
  // TODO: add more file images based on extenion
  // txt, bat, exe

  return (
    <Draggable nodeRef={nodeRef}>
      <div className={`icon-item ${selected ? 'selected' : ''}`} ref={nodeRef}>
        <div
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          className={`icon-button ${className} `}
        >
          <img alt="icon" src={image} />
          <div className="tint" />
          <p
            className="filename"
            style={{ color: selected ? 'white' : textColor }}
          >
            {label}
            {size && (
              <span
                style={{
                  display: 'block',
                  color: selected ? 'white' : '#777',
                  margin: 0,
                  fontSize: 10,
                }}
              >
                {size}
              </span>
            )}
          </p>
        </div>
      </div>
    </Draggable>
  )
}
