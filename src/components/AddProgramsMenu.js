import React, { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import { fs } from '../utils/files'
import errorPng from '../assets/error.png'
import { useStorageDetails } from '../useStorageDetails'

const upgrades = [
  {
    key: 'delete-speed-1',
    name: 'Delete speed',
    cost: 10,
    description: 'Reduce the time it takes to delete a file',
  },
  {
    key: 'delete-speed-2',
    name: 'Delete speed 2',
    cost: 100,
    description: 'Reduce the time it takes to delete a file further',
  },
  {
    key: 'delete-speed-3',
    name: 'Delete speed 3',
    cost: 1000,
    description: 'Reduce the time it takes to delete a file even further',
  },
  {
    key: 'select-multiple',
    name: 'Select multiple',
    cost: 100,
    description: 'Allow selection of multiple files',
  },
  {
    key: 'select-box',
    name: 'Select box',
    cost: 100,
    description: 'Allow selection of multiple files via box',
  },
  {
    key: 'delete-folders',
    name: 'Delete folders',
    cost: 100,
    description: 'Allow deletion of folders',
  },
]

export const AddProgramsMenu = ({ onClose, onClick, addWindow }) => {
  const { freeSpace, updateFiles } = useStorageDetails()

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
    try {
      fs.readdir('/C:/Program Files', (e, rv) => {
        setPurchased(rv)
      })
    } catch (e) {}
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
            <p>Free space: {freeSpace.toFixed(2)}KB</p>
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
                  {upgrade.name}...............
                  {(upgrade.cost / 1024).toFixed(2)}KB
                </li>
              ))}
            </ul>

            {selected && (
              <div>
                <p>{selected.name}</p>
                <p>cost: {(selected.cost / 1024).toFixed(2)}KB</p>
                <p>{selected.description}</p>
                <button
                  style={{ marginTop: 20 }}
                  onClick={() => {
                    if (purchased.includes(`${selected.key}.txt`)) {
                      addWindow({
                        type: 'prompt',
                        image: errorPng,
                        title: 'Error',
                        label: 'Already have this upgrade',
                      })
                      return
                    }
                    if (freeSpace * 1024 < selected.cost) {
                      addWindow({
                        type: 'prompt',
                        image: errorPng,
                        title: 'Error',
                        label: "You don't have enough free space",
                      })
                      return
                    }

                    try {
                      fs.writeFileSync(
                        `/C:/Program Files/${selected.key}.txt`,
                        new Array(selected.cost + 1).join('a'),
                      )
                      setPurchased([...purchased, `${selected.key}.txt`])
                      updateFiles()
                    } catch (e) {}
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
