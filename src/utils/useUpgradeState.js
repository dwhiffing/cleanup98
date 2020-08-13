import { atom, useRecoilState } from 'recoil'
import { useEffect } from 'react'
import { getUpgrades } from '../utils/fileSystem'

export const upgradeState = atom({
  key: 'upgradeState',
  default: [],
})

export const useUpgradeState = () => {
  const [upgrades, setUpgrades] = useRecoilState(upgradeState)
  useEffect(() => {
    getUpgrades().then(setUpgrades)
  }, [setUpgrades])
  const forceUpdate = () => {
    getUpgrades().then(setUpgrades)
  }
  return [upgrades, forceUpdate]
}
