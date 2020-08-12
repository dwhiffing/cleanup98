import { atom, useRecoilState } from 'recoil'
import { useEffect } from 'react'
import { getUpgrades } from './fileSystem'

export const upgradeState = atom({
  key: 'upgradeState',
  default: [],
})

export const useUpgradeState = () => {
  const [upgrades, setUpgrades] = useRecoilState(upgradeState)
  useEffect(() => {
    getUpgrades().then(setUpgrades)
  }, [setUpgrades])
  return [upgrades, setUpgrades]
}
