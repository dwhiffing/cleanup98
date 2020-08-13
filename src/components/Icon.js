import React from 'react'
import { useWindowState } from '../utils/useWindowState'
import { ERROR_PROMPT } from '../constants'

export const Icon = ({
  item,
  upgrades = {},
  textColor,
  selected,
  onClick,
  onDoubleClick,
}) => {
  const [, windowActions] = useWindowState()
  const { name, size } = item
  const disabled = upgrades.permissions < item.accessLevel
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
      disabled={disabled}
      onDoubleClick={() => {
        if (disabled) {
          windowActions.addWindow({
            ...ERROR_PROMPT,
            label: 'Cannot view this protected folder',
          })
          return
        }
        windowActions.addWindow({
          type: 'path',
          title: item.name,
          path: item.path,
          accessLevel: item.accessLevel,
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
  disabled,
  selected,
  size,
  className = '',
  textColor = 'black',
}) => {
  return (
    <div
      className={`icon-item ${selected ? 'selected' : ''}`}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
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
