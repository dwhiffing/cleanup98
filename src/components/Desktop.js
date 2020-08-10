import React from 'react'
import { Icon } from './Icon'
import computerPng from '../assets/computer.png'
export const Desktop = (props) =>
  props.shouldRender && (
    <div
      style={{
        position: 'absolute',
      }}
    >
      {[
        {
          type: 'folder',
          name: 'My Computer',
          image: computerPng,
          isFolder: true,
          path: '/',
        },
      ].map((item) => (
        <Icon
          key={`item-${item.name}`}
          item={item}
          textColor="white"
          {...props.actions}
        />
      ))}
    </div>
  )
