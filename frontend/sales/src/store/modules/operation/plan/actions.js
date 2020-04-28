//ctx = {state, rootState, dispatch, commit, getters, rootGetters}

export const inserts = ({ rootState, commit }, item) => {
  // state.loading = true
  const { _id, processes } = item
  const { properties: _process_standard } = rootState.standards.find(sta => sta._id === 'Proc_Standard')
  const docs = processes.map(process => ({ ..._process_standard, ...process, ...{ _id: `${_id}:${process.key}`, for: _id } }))
  console.log('inserts plans', docs)
  commit('Worker', { name: 'inserts', payload: docs })
}
