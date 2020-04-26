export const findProcessTopLevel = process => {
  const keys = Object.keys(process)
  const len = keys.length
  for (let i = 0; i < len; ++i) {
    const key = keys[i]
    if (process[key].level === 0) return process[key]
  }
}
