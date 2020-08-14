import React from 'react'
import Draggable from 'react-draggable'
import { useStorageDetails } from '../utils/useStorageDetails'

// TODO: update this to better communicate win condition
export const DrivePropertiesMenu = ({ onClose, windowData }) => {
  const { capacity, freeSpace, usedSpace } = useStorageDetails()
  const nodeRef = React.useRef(null)
  const width = 400
  const height = 200
  return (
    <Draggable
      nodeRef={nodeRef}
      bounds={{ left: 0, top: 0 }}
      defaultPosition={{
        x: window.innerWidth / 2 - width / 2,
        y: window.innerHeight / 2 - height,
      }}
      handle=".title-bar"
    >
      <div ref={nodeRef} onClick={windowData.onClick} className="prompt-wrap">
        <div className="window" style={{ width, height }}>
          <div className="title-bar">
            <div className="title-bar-text">Drive Properties</div>
            <div className="title-bar-controls">
              <button aria-label="Close" onClick={onClose}></button>
            </div>
          </div>
          <div className="window-body">
            <div className="px-6 w-full">
              <div className="row">
                <p>Used Space:</p>
                <p>{usedSpace * 1024} bytes</p>
                <p>{`${usedSpace.toFixed(3)}KB`}</p>
              </div>

              <div className="row">
                <p>Free Space:</p>
                <p>{freeSpace * 1024} bytes</p>
                <p>{`${freeSpace.toFixed(3)}KB`}</p>
              </div>

              <hr className="w-full" />

              <div className="row">
                <p>Capacity:</p>
                <p>{capacity * 1024} bytes</p>
                <p>{`${capacity.toFixed(3)}KB`}</p>
              </div>
            </div>

            <button className="mt-4" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  )
}
