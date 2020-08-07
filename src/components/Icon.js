import React from 'react'
import Draggable from 'react-draggable'

export const Icon = ({ image, label, onClick }) => (
  <Draggable>
    <div style={{ margin: 10, width: 70 }}>
      <div onDoubleClick={onClick} className="icon-button">
        <img alt="icon" src={image} />
        <p>{label}</p>
      </div>
    </div>
  </Draggable>
)
