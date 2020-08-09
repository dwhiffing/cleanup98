import React from 'react'
import { Item } from './Item'
export const Desktop = (props) => (
  <div
    style={{
      position: 'absolute',
    }}
  >
    {props.tree.map((item) => (
      <Item
        key={`item-${item.name}`}
        item={item}
        textColor="white"
        {...props.actions}
      />
    ))}
  </div>
)
