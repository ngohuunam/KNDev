export const construct = ({ properties }) => {
  const res = {}
  Object.entries(properties).map(([k, v]) => (res[k] = v.default || ''))
  console.log('construct res', res)
  return res
}
