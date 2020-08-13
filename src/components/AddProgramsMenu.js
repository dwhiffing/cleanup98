import React, { useState } from 'react'
import Draggable from 'react-draggable'
import { addFile } from '../utils/fileSystem'
import { useStorageDetails } from '../utils/useStorageDetails'
import {
  ALREADY_INSTALLED_ERROR,
  NOT_ENOUGH_SPACE_ERROR,
  UPGRADES,
} from '../constants'
import { useUpgradeState } from '../utils/useUpgradeState'
import { useWindowState } from '../utils/useWindowState'

export const AddProgramsMenu = ({ onClose, windowData }) => {
  const { freeSpace } = useStorageDetails()
  const [selected, setSelected] = useState(null)
  const nodeRef = React.useRef(null)
  const width = 400
  const height = 400
  // TODO: prompt on success
  // TODO: refactor
  // TODO: improve design
  const [upgrades, setUpgrades] = useUpgradeState()
  const [, actions] = useWindowState()

  const buySelected = () => {
    if (upgrades.includes(selected.key)) {
      actions.addWindow(ALREADY_INSTALLED_ERROR)
      return
    }
    if (freeSpace * 1024 < selected.cost) {
      actions.addWindow(NOT_ENOUGH_SPACE_ERROR)
      return
    }

    try {
      addFile(
        `/C:/Program Files/${selected.key}.exe`,
        new Array(selected.cost + 1).join('a'),
      )
      setUpgrades([...upgrades, selected.key])
    } catch (e) {}
  }

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
      <div ref={nodeRef} onClick={windowData.onClick} className="prompt-wrap">
        <div className="window" style={{ width, height }}>
          <div className="title-bar">
            <div className="title-bar-text">Add Programs</div>
            <div className="title-bar-controls">
              <button aria-label="Close" onClick={onClose}></button>
            </div>
          </div>

          <div className="window-body">
            <p>Free space: {freeSpace.toFixed(2)}KB</p>

            <ul
              className="tree-view w-full"
              style={{ height: 180, overflowY: 'scroll' }}
            >
              {UPGRADES.map((upgrade) => (
                <li
                  key={upgrade.key}
                  onClick={() => setSelected(upgrade)}
                  className="cursor-pointer p-1"
                  style={{
                    background:
                      selected && selected.key === upgrade.key
                        ? 'rgb(0,21,163)'
                        : 'transparent',
                    color:
                      selected && selected.key === upgrade.key
                        ? 'white'
                        : 'black',
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
                <button className="mt-4" onClick={buySelected}>
                  Add
                </button>
              </div>
            )}

            <button className="mt-4" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  )
}
