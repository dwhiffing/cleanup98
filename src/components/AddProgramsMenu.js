import React, { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import { fs } from '../utils/files'

const upgrades = [
  {
    key: 'delete-speed',
    name: 'Delete speed',
    cost: 100,
    description: 'Reduce the time it takes to delete a file',
  },
]

export const AddProgramsMenu = ({
  onClose,
  onClick,
  freeSpace,
  updateFiles,
}) => {
  const [selected, setSelected] = useState(null)
  const [purchased, setPurchased] = useState(null)
  const nodeRef = React.useRef(null)
  const width = 400
  const height = 400

  // TODO: display cost
  // TODO: add more upgrades
  // TODO: various delete speed upgrades
  // TODO: various directory deletion depth upgrades
  // TODO: various selection of multiple files at once upgrades
  // TODO: remove nag prompt
  // TODO: drag to select multiple files
  // TODO: remove confirm delete prompt

  useEffect(() => {
    fs.readdir('/C:/Program Files', (e, rv) => {
      setPurchased(rv)
    })
  }, [])

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds={{ left: 0, top: 0 }}
      defaultPosition={{
        x: window.innerWidth / 2 - width / 2,
        y: window.innerHeight / 2 - height / 2,
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
            <div className="title-bar-text">Add Programs</div>
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
            <p>Free space: {freeSpace}KB</p>
            <ul className="tree-view" style={{ width: '90%', height: 120 }}>
              {upgrades.map((upgrade) => (
                <li
                  key={upgrade.key}
                  onClick={() => setSelected(upgrade)}
                  style={{
                    background:
                      selected && selected.key === upgrade.key
                        ? 'blue'
                        : 'transparent',
                    color:
                      selected && selected.key === upgrade.key
                        ? 'white'
                        : 'black',
                    padding: 2,
                    cursor: 'pointer',
                  }}
                >
                  {upgrade.name}
                </li>
              ))}
            </ul>

            {selected && (
              <div>
                <p>{selected.name}</p>
                <button
                  style={{ marginTop: 20 }}
                  onClick={() => {
                    if (
                      freeSpace * 1024 >= selected.cost &&
                      !purchased.includes(`${selected.key}.txt`)
                    ) {
                      fs.writeFileSync(
                        `/C:/Program Files/${selected.key}.txt`,
                        // TODO: generate file size based on cost
                        'asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdd',
                      )
                      setPurchased([...purchased, `${selected.key}.txt`])
                      updateFiles()
                    } else {
                      console.log('error')
                    }
                  }}
                >
                  Add
                </button>
              </div>
            )}
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
