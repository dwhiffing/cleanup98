import { getContentForPath } from './fileSystem'
import { useRecoilState, atom } from 'recoil'
import mapValues from 'lodash/mapValues'

export const fileState = atom({
  key: 'fileState',
  default: {},
})

export const useFileState = () => {
  const [files, setFiles] = useRecoilState(fileState)

  const updatePath = (path) => {
    getContentForPath({ path }).then((content) => {
      setFiles((files) => ({ ...files, [path]: content }))
    })
  }

  const removePath = (path) => {
    setFiles((files) => {
      const values = mapValues(files, (file) =>
        file.filter((f) => f.path !== path),
      )
      console.log(path, files, values)
      return values
    })
  }

  return { files, updatePath, removePath }
}
