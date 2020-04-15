import Vue from 'vue'

export const Worker = async ({ commit, rootState }, payload) => {
  rootState.Dialog.loading = true
  commit('Worker', payload)
}

export const newItem = async ({ state, commit, rootState }) => {
  rootState.Dialog.loading = true
  commit('Worker', { name: 'newItem', payload: state.converted })
}

export const allNewOrderCheck = ({ state, commit }) => {
  state.btnIcon['allNewOrderCheck'] = true
  const payload = { datas: [], indexs: [] }
  state.list.map((ord, i) => {
    if (!ord.ui) {
      ord.icon = 'pi-spin pi-spinner color-red'
      payload.datas.push({ ...ord })
      payload.indexs.push(i)
    }
  })
  commit('Worker', { name: 'allNewOrderCheck', payload })
}

export const newOrderCheck = ({ state, commit }, { data, index }) => {
  data.icon = 'pi-spin pi-spinner color-red'
  Vue.set(state.list, index, data)
  commit('Worker', { name: 'newOrderCheck', payload: { data, index } })
}

export const droppedOrderCheck = ({ state, commit }, { data, index }) => {
  data.icon = 'pi-spin pi-spinner color-red'
  Vue.set(state.list, index, data)
  commit('Worker', { name: 'droppedOrderCheck', payload: { data, index } })
}

export const allDroppedOrderCheck = ({ state, commit }) => {
  state.btnIcon['allDroppedOrderCheck'] = true
  const payload = { datas: [], indexs: [] }
  state.list.map((ord, i) => {
    if (ord.dropped) {
      ord.icon = 'pi-spin pi-spinner color-red'
      payload.datas.push({ ...ord })
      payload.indexs.push(i)
    }
  })
  commit('Worker', { name: 'allDroppedOrderCheck', payload })
}

export const changeCheck = ({ state, commit }, { _id, key, index }) => {
  const _item = { ...state.list[index] }
  _item.ui[key].checking = true
  Vue.set(state.list, index, _item)
  commit('Worker', { name: 'changeCheck', payload: { _id, key, index } })
}
