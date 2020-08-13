import React from 'react'
import { useWindowState } from '../utils/useWindowState'

export const Icon = ({ item, textColor, selected, onClick, onDoubleClick }) => {
  const [, windowActions] = useWindowState()
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
        windowActions.addWindow({
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
  size,
  className = '',
  textColor = 'black',
}) => {
  return (
    <div className={`icon-item ${selected ? 'selected' : ''}`}>
      <div
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={`icon-button relative ${className} `}
      >
        <img alt="icon" src={image} style={{ width: 40 }} />
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
  )
}
