import { tToString } from '../../../../utils'

// export const ui = (state, getters, { user }) => user.state[year].order.film.ui

export const newOrderConfirmTableProperties = ({ converted }) =>
  converted
    ? [
        { name: 'ID', value: converted._id },
        { name: 'Foreign Title', value: converted.foreignTitle },
        { name: 'Vietnamese Title', value: converted.vietnameseTitle },
        { name: 'Client', value: converted.client },
        { name: 'Team', value: converted.team },
        { name: 'NKC', value: tToString(converted.premiereDate, false, '', 'numeric') },
        { name: 'Deadline', value: tToString(converted.endAt, true, 'Empty', 'numeric') },
        { name: 'Processes', value: converted.processes.map(process => process.key.toProperCase()).join(', ') },
        { name: 'Products', value: converted.products.map(product => product.name.toProperCase()).join(', ') },
      ]
    : []

// export const newProdConfirmTableProperties = state => {
//   if (state.newProdConverted)
//     return [
//       { name: 'ID', value: state.newProdConverted._id },
//       { name: 'Product Name', value: state.newProdConverted.name },
//       { name: 'Type', value: state.newProdConverted.type },
//       { name: 'Details:', value: htmlStrip(state.newProdConverted.details) },
//       { name: 'Deadline', value: tToString(state.newProdConverted.endAt, true, 'Not assign yet', 'numeric') },
//     ]
//   else return []
// }

// export const tableList = ({ list }, getters, { year, user }) => {
//   const ui = user.state[year].order.film.ui
//   const tableList = list.reduce((pre, cur) => [...pre, ...(ui[cur._id] && ui[cur._id].dropped ? [] : [cur])], [])
//   console.log('tableList', tableList)
//   return tableList
// }

// export const tableList = ({ list }, getters, { year, user }) => {
//   const ui = user.state[year].order.film.ui
//   const tableList = list.reduce((pre, cur, i) => {
//     if (ui[cur._id] && ui[cur._id].dropped) return pre
//     cur.index = i
//     pre.push(cur)
//     return pre
//   }, [])
//   console.log('tableList', tableList)
//   return tableList
// }
