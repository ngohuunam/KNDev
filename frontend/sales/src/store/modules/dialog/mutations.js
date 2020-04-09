export const setMess = (state, value) => {
  state.message = value
}

export const setState = (state, { key, data }) => {
  state[key] = data
}
