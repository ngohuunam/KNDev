// import Vue from 'vue'

export const Worker = ({ commit, rootState }, payload) => {
  rootState.dialog.loading = true
  commit('Worker', payload)
}

export const inserts = ({ commit, rootGetters }, order) => {
  // state.loading = true
  const { _id, products, _rev, dropped } = order
  const _prod = rootGetters['prod/construct']('film')
  const docs = products.map(product => ({ ..._prod, ...product, ...{ _id: `${_id}:${product.name.to_id()}`, parent: { _id, _rev, dropped } } }))
  console.log('inserts prods', docs)
  commit('Worker', { name: 'inserts', payload: docs })
}
