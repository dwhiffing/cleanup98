import React, { useState, useEffect } from 'react'
import folderPng from '../assets/folder.png'
import windowsPng from '../assets/windows-4.png'
import logoutPng from '../assets/logout.png'
import shutdownPng from '../assets/shutdown.png'
import helpPng from '../assets/help.png'
import arrowPng from '../assets/arrow.png'
import installPng from '../assets/install.png'
import drivePng from '../assets/drive.png'
import trashPng from '../assets/trash-empty.png'
import programPng from '../assets/programs.png'
import findPng from '../assets/find.png'
import settingsPng from '../assets/settings.png'
import { ADD_PROGRAMS_MENU, DRIVE_PROPERTIES_MENU } from '../constants'
import { useWindowState } from '../utils/useWindowState'
import { useUpgradeState } from '../utils/useUpgradeState'

export const TaskBar = () => {
  const [windows, actions] = useWindowState()
  return (
    <div>
      <div className="absolute flex window bottom-0 left-0 right-0">
        <StartButton />

        {windows
          .concat()
          .sort((a, b) => a.index - b.index)
          .map((w) => (
            <button
              key={`task-bar-${w.index}`}
              className={
                w.index === windows[windows.length - 1].index ? 'active' : ''
              }
              onClick={() => {
                // TODO: if window is active, should minimize
                // if window is minimized, should maximize
                // if window is inactive, should make active
                actions.onMinimize(w)
              }}
            >
              {w.title}
            </button>
          ))}
      </div>
    </div>
  )
}

export const StartButton = () => {
  const [startMenu, setStartMenu] = useState({})
  const [, actions] = useWindowState()
  const [upgrades, , forceUpdate] = useUpgradeState()

  useEffect(() => {
    const listener = document.addEventListener('click', (e) => {
      forceUpdate()
      if (!e.target.classList.contains('start-button')) {
        setStartMenu({ visible: false })
      }
    })
    return () => document.removeEventListener('click', listener)
  }, [])

  const START_MENU_BUTTONS = [
    {
      text: 'Programs',
      image: programPng,
      buttons: [
        {
          text: 'Install programs',
          image: installPng,
          onClick: () => actions.addWindow(ADD_PROGRAMS_MENU),
        },
        upgrades.includes('autodeleter') && {
          text: 'Autodeleter',
          image: trashPng,
          onClick: () =>
            actions.addWindow({
              type: 'auto-delete-prompt',
              title: 'AutoDeleter',
            }),
        },
        {
          text: 'Disk Properties',
          image: drivePng,
          onClick: () => actions.addWindow(DRIVE_PROPERTIES_MENU),
        },
      ],
    },
    {
      text: 'Settings',
      image: settingsPng,
    },
    {
      text: 'Find',
      image: findPng,
    },
    {
      text: 'Help',
      image: helpPng,
    },
    {
      text: 'Run...',
      image: folderPng,
    },
    {
      text: 'Log Off',
      image: logoutPng,
    },
    {
      text: 'Shut Down...',
      image: shutdownPng,
    },
  ]

  return (
    <>
      {startMenu.visible && (
        <div
          className="absolute z-50 flex"
          style={{ left: 3, bottom: 30, width: 180 }}
        >
          <HoverMenu showBanner buttons={startMenu.buttons} />
        </div>
      )}
      <button
        className="start-button"
        onClick={() => {
          setStartMenu({
            visible: true,
            buttons: START_MENU_BUTTONS,
          })
        }}
      >
        <img alt="Start" className="pointer-events-none" src={windowsPng} />
        Start
      </button>
    </>
  )
}

export const HoverMenu = ({ buttons, showBanner = false }) => {
  const [visibleMenu, setVisibleMenu] = useState(null)
  return (
    <div className="window flex flex-1 relative" style={{ zIndex: 9999 }}>
      {showBanner && (
        <div style={{ backgroundColor: 'rgb(0, 21, 163)', width: 20 }} />
      )}
      <div className="flex-1">
        {buttons
          .filter((t) => !!t)
          .map((b) => (
            <div
              key={`start-button-${b.text}`}
              className="start-menu-button relative"
              onClick={b.onClick}
              onMouseEnter={() => setVisibleMenu(b.text)}
            >
              {b.image && (
                <img
                  alt="icon"
                  src={b.image}
                  style={{ width: 25, margin: 5 }}
                />
              )}
              <p
                key={`button-${b.text}`}
                style={{ marginLeft: b.image ? 0 : 15 }}
              >
                {b.text}
              </p>

              {b.buttons && (
                <div className="absolute" style={{ right: 2 }}>
                  <img alt="arrow" src={arrowPng} />
                </div>
              )}

              {b.buttons && visibleMenu === b.text && (
                <div
                  className="absolute"
                  style={{ top: -3, left: 157, width: 150 }}
                >
                  <HoverMenu buttons={b.buttons} />
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
