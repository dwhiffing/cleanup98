import React, { useState } from 'react'
import Draggable from 'react-draggable'
import { addFile, rmdir } from '../utils/fileSystem'
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
  // TODO: improve design, add context on what upgrades do
  const [upgrades, forceUpdate] = useUpgradeState()
  const [, actions] = useWindowState()

  const selectedUpgradeLevel = selected
    ? getUpgradeLevel(upgrades, selected.key)
    : 0
  const selectedDisabled = selected
    ? selectedUpgradeLevel >= (selected.maxLevel || 1)
    : false

  const buySelected = () => {
    if (selectedUpgradeLevel >= (selected.maxLevel || 1)) {
      actions.addWindow({ ...ALREADY_INSTALLED_ERROR, label: 'At max level' })
      return
    }

    if (freeSpace * 1024 < getUpgradeCost(upgrades, selected)) {
      actions.addWindow(NOT_ENOUGH_SPACE_ERROR)
      return
    }
    try {
      addFile(
        `/C:/Program Files/${selected.key}_${selectedUpgradeLevel + 1}.exe`,
        new Array(Math.round(getUpgradeCost(upgrades, selected))).join('a'),
      )
      forceUpdate()
      rmdir(`/C:/Program Files/${selected.key}_${selectedUpgradeLevel}.exe`)
      actions.addWindow({
        type: 'prompt',
        title: 'Installed',
        label: `${selected.name} Installed successfully.  Check the Start Menu to find your new programs`,
      })
    } catch (e) {
      console.log(e)
    }
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
              {UPGRADES.map((upgrade) => {
                const currentLevel = getUpgradeLevel(upgrades, upgrade.key)
                const disabled = currentLevel >= (upgrade.maxLevel || 1)
                return (
                  <li
                    key={upgrade.key}
                    onClick={() => setSelected(upgrade)}
                    className="cursor-pointer p-1"
                    style={{
                      background:
                        selected && selected.key === upgrade.key
                          ? disabled
                            ? 'gray'
                            : 'rgb(0,21,163)'
                          : 'transparent',
                      color:
                        selected && selected.key === upgrade.key
                          ? 'white'
                          : disabled
                          ? '#999'
                          : 'black',
                    }}
                  >
                    {upgrade.name} {disabled ? '' : +currentLevel + 1}
                    ...............
                    {disabled
                      ? 'Max Level'
                      : `${(getUpgradeCost(upgrades, upgrade) / 1024).toFixed(
                          2,
                        )}KB`}
                  </li>
                )
              })}
            </ul>

            {selected && (
              <div>
                <p>{selected.name}</p>
                {!selectedDisabled && (
                  <p>
                    cost:{' '}
                    {(getUpgradeCost(upgrades, selected) / 1024).toFixed(2)}
                    KB
                  </p>
                )}
                <p>{selected.description}</p>
                {!selectedDisabled && (
                  <button className="mt-4" onClick={buySelected}>
                    Add
                  </button>
                )}
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

const getUpgradeLevel = (upgrades, key) => {
  return upgrades[key] || 0
}

const getUpgradeCost = (upgrades, upgrade) => {
  const level = getUpgradeLevel(upgrades, upgrade.key)
  const previousLevelCost =
    level === 0
      ? 0
      : upgrade.cost * Math.pow(upgrade.costFactor || 1.2, level - 1)
  const levelCost = upgrade.cost * Math.pow(upgrade.costFactor || 1.2, level)
  return levelCost - previousLevelCost
}
