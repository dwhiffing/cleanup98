import React from 'react'
import { Icon } from './Icon'

export const Item = ({
  addWindow,
  item,
  textColor,
  selected,
  onClick,
  onDoubleClick,
}) => {
  return (
    <Icon
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
