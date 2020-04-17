import Vue from 'vue'

export const Worker = ({ commit, rootState }, payload) => {
  rootState.dialog.loading = true
  commit('Worker', payload)
}

// export const newItem = async ({ state, commit, rootState }) => {
//   rootState.Dialog.loading = true
//   commit('Worker', { name: 'newItem', payload: state.converted })
// }

export const allNewCheck = ({ state, commit }) => {
  state.btnIcon['allNewCheck'] = true
  const payload = { datas: [], indexs: [] }
  state.list.map((ord, i) => {
    if (!ord.ui) {
      ord.icon = 'pi-spin pi-spinner color-red'
      payload.datas.push({ ...ord })
      payload.indexs.push(i)
    }
  })
  commit('Worker', { name: 'allNewCheck', payload })
}

export const newCheck = ({ state, commit }, { data, index }) => {
  data.icon = 'pi-spin pi-spinner color-red'
  Vue.set(state.list, index, data)
  commit('Worker', { name: 'newCheck', payload: { data, index } })
}

export const droppedCheck = ({ state, commit }, { data, index }) => {
  data.icon = 'pi-spin pi-spinner color-red'
  Vue.set(state.list, index, data)
  commit('Worker', { name: 'droppedCheck', payload: { data, index } })
}

export const allDroppedCheck = ({ state, commit }) => {
  state.btnIcon['allDroppedCheck'] = true
  const payload = { datas: [], indexs: [] }
  state.list.map((ord, i) => {
    if (ord.dropped) {
      ord.icon = 'pi-spin pi-spinner color-red'
      payload.datas.push({ ...ord })
      payload.indexs.push(i)
    }
  })
  commit('Worker', { name: 'allDroppedCheck', payload })
}

export const changeCheck = ({ state, commit }, { _id, key, index }) => {
  const _item = { ...state.list[index] }
  _item.ui[key].checking = true
  Vue.set(state.list, index, _item)
  commit('Worker', { name: 'changeCheck', payload: { _id, key, index } })
}
