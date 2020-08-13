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
      const values = mapValues(files, (file) => {
        if (!file.filter) {
          console.log(file)
          return file
        }
        return file.filter((f) => f.path !== path)
      })
      return values
    })
  }

  return { files, updatePath, removePath }
}
