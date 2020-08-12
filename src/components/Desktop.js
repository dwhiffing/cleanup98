import React from 'react'
import { Icon } from './Icon'
import computerPng from '../assets/computer.png'

export const Desktop = (props) =>
  props.shouldRender && (
    <div className="absolute">
      {[MY_COMPUTER].map((item) => (
        <Icon key={`item-${item.name}`} item={item} textColor="white" />
      ))}
    </div>
  )

const MY_COMPUTER = {
  type: 'folder',
  name: 'My Computer',
  image: computerPng,
  isFolder: true,
  path: '/',
}
