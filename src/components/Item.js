import React from 'react'
import { Icon } from './Icon'

export const Item = ({ addWindow, item, textColor, selected, onClick }) => {
  return (
    <Icon
      type="folder"
      label={item.name}
      image={item.image}
      textColor={textColor}
      selected={selected}
      onClick={onClick}
      onDoubleClick={() =>
        addWindow({
          title: item.name,
          path: item.path,
        })
      }
    />
  )
}
