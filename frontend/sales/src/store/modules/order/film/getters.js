import { tToString, htmlStrip } from '@/tools'

export const openDialog = state => {
  return state.createNewOrder || state.wantDelOrder
}

export const newOrders = state => {
  return state.changes.filter(o => o.new)
}

export const hasNewOrder = (state, getters) => {
  return getters.newOrders.length > 0
}

export const isNewOrder = (state, getters) => _id => {
  return getters.newOrders.some(o => o._id === _id)
}

export const droppedOrders = state => {
  return state.list.filter(o => o.dropped)
}

export const isDroppedOrder = (state, getters) => _id => {
  return getters.droppedOrders.some(o => o._id === _id)
}

export const hasOrderChanged = state => {
  return state.changes.length > 0
}

export const isExisted = state => _id => {
  return state.list.some(o => o._id === _id)
}

export const newOrderConfirmTableProperties = state => {
  if (state.newOrderConverted)
    return [
      { name: 'ID', value: state.newOrderConverted._id },
      { name: 'Foreign Title', value: state.newOrderConverted.foreignTitle },
      { name: 'Vietnamese Title', value: state.newOrderConverted.vietnameseTitle },
      { name: 'Client', value: state.newOrderConverted.client },
      { name: 'Team', value: state.newOrderConverted.team },
      { name: 'NKC', value: tToString(state.newOrderConverted.premiereDate, false, '', 'numeric') },
      { name: 'Deadline', value: tToString(state.newOrderConverted.endAt, true, 'Empty', 'numeric') },
    ]
  else return []
}

export const newProdConfirmTableProperties = state => {
  if (state.newProdConverted)
    return [
      { name: 'ID', value: state.newProdConverted._id },
      { name: 'Product Name', value: state.newProdConverted.name },
      { name: 'Type', value: state.newProdConverted.type },
      { name: 'Details:', value: htmlStrip(state.newProdConverted.details) },
      { name: 'Deadline', value: tToString(state.newProdConverted.endAt, true, 'Not assign yet', 'numeric') },
    ]
  else return []
}
