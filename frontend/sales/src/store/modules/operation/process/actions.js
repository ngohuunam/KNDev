//ctx = {state, rootState, dispatch, commit, getters, rootGetters}

// import isEqual from 'lodash.isequal'
// import { getProcessStatus } from '../../../../utils'

export const inserts = ({ rootState, commit }, { source, year, db, col, label, groupLabel }) => {
  // state.loading = true
  const { _id, processes } = source
  const topLvProc = processes.find(pro => pro.level === 0)
  topLvProc.start = Date.now()
  topLvProc.end = topLvProc.start + topLvProc.aot * 24 * 3600 * 1000
  topLvProc.status = 'Need to filled'
  const { properties: processTemplate } = rootState.standards.find(sta => sta._id === 'Proc_Standard')
  const docs = processes.map(process => ({
    ...processTemplate,
    ...process,
    ...{ _id: `${_id}:${process.key}`, of: { year, db, col, _id }, group: _id, label: label + process.label, groupLabel },
  }))
  console.log('inserts processes', docs)
  commit('Worker', { name: 'inserts', payload: docs })
}

// export const save = ({ state, commit }, { index, data }) => {
//   const current = state.list[index]
//   const setObj = Object.entries(data).reduce((pre, [key, value]) => ({ ...pre, ...(isEqual(current[key], value) ? {} : { [key]: value }) }), {})
//   // setObj.status = getProcessStatus(data)
//   delete setObj.logs
//   const updateObj = { $set: setObj }
//   console.log('updateObj', updateObj)
//   commit('Worker', { name: 'update', payload: { _id: current._id, updateObj, note: '' } })
// }
