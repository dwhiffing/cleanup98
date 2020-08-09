import React from 'react'
import Draggable from 'react-draggable'
import { useStorageDetails } from '../useStorageDetails'

export const DrivePropertiesMenu = ({ onClose, onClick }) => {
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
      <div
        ref={nodeRef}
        onClick={onClick}
        style={{
          zIndex: 90,
          position: 'absolute',
        }}
      >
        <div className="window" style={{ width, height }}>
          <div className="title-bar">
            <div className="title-bar-text">Drive Properties</div>
            <div className="title-bar-controls">
              <button aria-label="Close" onClick={onClose}></button>
            </div>
          </div>
          <div
            className="window-body"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '80%',
                paddingLeft: 40,
                paddingRight: 40,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <p>Used Space:</p>
                <p>{usedSpace * 1024} bytes</p>
                <p>{`${usedSpace.toFixed(3)}KB`}</p>
              </div>

              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <p>Free Space:</p>
                <p>{freeSpace * 1024} bytes</p>
                <p>{`${freeSpace.toFixed(3)}KB`}</p>
              </div>
              <hr style={{ width: '100%' }} />

              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <p>Capacity:</p>
                <p>{capacity * 1024} bytes</p>
                <p>{`${capacity.toFixed(3)}KB`}</p>
              </div>
            </div>

            <button
              style={{ marginTop: 20 }}
              onClick={() => {
                onClose()
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  )
}
