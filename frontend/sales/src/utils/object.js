export const isObjEmpty = obj => {
  for (let key in obj) return false
  return true
}

export const objectDeep = (dotPath, obj, separator) => dotPath.split(separator || '.').reduce((o, i) => o?.[i], obj)
