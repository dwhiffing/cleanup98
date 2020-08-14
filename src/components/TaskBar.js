import React, { useState, useEffect } from 'react'
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
import {
  ADD_PROGRAMS_MENU,
  DRIVE_PROPERTIES_MENU,
  HELP_PROMPT,
} from '../constants'
import { useWindowState } from '../utils/useWindowState'
import { useUpgradeState } from '../utils/useUpgradeState'
import useSound from 'use-sound'
import boopSfx from '../assets/click.mp3'

export const TaskBar = () => {
  const [windows, actions] = useWindowState()
  return (
    <div>
      <div
        style={{ height: 28 }}
        className="absolute flex window bottom-0 left-0 right-0"
      >
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
  const [upgrades, forceUpdate] = useUpgradeState()
  const [play] = useSound(boopSfx)

  useEffect(() => {
    const listener = document.addEventListener('click', (e) => {
      forceUpdate()
      if (!e.target.classList.contains('start-button')) {
        setStartMenu({ visible: false })
      }
    })
    return () => document.removeEventListener('click', listener)
    // TODO: fix this
    // eslint-disable-next-line
  }, [])

  const START_MENU_BUTTONS = [
    {
      text: 'Programs',
      image: programPng,
      buttons: [
        upgrades['autodeleter'] && {
          text: 'Autodeleter',
          image: trashPng,
          onClick: () =>
            actions.addWindow({
              type: 'auto-delete-prompt',
              title: 'AutoDeleter',
            }),
        },
      ].filter((t) => !!t),
    },
    {
      text: 'Settings',
      image: settingsPng,
      buttons: [
        {
          text: 'Install programs',
          image: installPng,
          onClick: () => actions.addWindow(ADD_PROGRAMS_MENU),
        },
        {
          text: 'Disk Properties',
          image: drivePng,
          onClick: () => actions.addWindow(DRIVE_PROPERTIES_MENU),
        },
      ],
    },
    {
      text: 'Find',
      image: findPng,
      onClick: () =>
        actions.addWindow({ type: 'path', path: '/', name: 'My Computer' }),
    },
    {
      text: 'Help',
      image: helpPng,
      onClick: () => actions.addWindow(HELP_PROMPT),
    },
    {
      text: 'Log Off',
      image: logoutPng,
      onClick: () => {
        actions.addWindow({
          type: 'prompt',
          title: 'Log Off',
          image: logoutPng,
          label:
            'This will reset your progress and you will have to start over. Do you want to continue?',
          buttons: [
            {
              text: 'OK',
              onClick: () => {
                localStorage.clear()
                window.location.reload()
              },
            },
          ],
        })
      },
    },
    {
      text: 'Shut Down...',
      image: shutdownPng,
      onClick: () => {
        actions.addWindow({
          type: 'prompt',
          image: shutdownPng,
          title: 'Shut down',
          label:
            'This will reset your progress and you will have to start over. Do you want to continue?',
          buttons: [
            {
              text: 'OK',
              onClick: () => {
                localStorage.clear()
                window.location.reload()
              },
            },
          ],
        })
      },
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
          play()
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
  const [play] = useSound(boopSfx)
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
              onClick={() => {
                play()

                b.onClick && b.onClick()
              }}
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

              {b.buttons && b.buttons.length > 0 && (
                <div className="absolute" style={{ right: 2 }}>
                  <img alt="arrow" src={arrowPng} />
                </div>
              )}

              {b.buttons && b.buttons.length > 0 && visibleMenu === b.text && (
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
