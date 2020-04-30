//ctx = {state, rootState, dispatch, commit, getters, rootGetters}

export const inserts = ({ rootState, commit }, { source, year, db, col, label }) => {
  // state.loading = true
  const { _id, processes } = source
  const { properties: _process_standard } = rootState.standards.find(sta => sta._id === 'Proc_Standard')
  const docs = processes.map(process => ({
    ..._process_standard,
    ...process,
    ...{ _id: `${_id}:${process.key}`, of: { year, db, col, _id }, group: _id, label: label + process.label },
  }))
  console.log('inserts processes', docs)
  commit('Worker', { name: 'inserts', payload: docs })
}
