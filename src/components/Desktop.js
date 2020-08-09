import React from 'react'
import { Icon } from './Icon'
export const Desktop = (props) => (
  <div
    style={{
      position: 'absolute',
    }}
  >
    {props.tree.map((item) => (
      <Icon
        key={`item-${item.name}`}
        item={item}
        textColor="white"
        {...props.actions}
      />
    ))}
  </div>
)
