import { tToString, htmlStrip } from '../../../../utils'

// export const tableList = ({ list, table }) => {
//   console.log(table)
//   const res = list.filter(item => table.includes(item.orderId))
//   console.log(res)
//   return res
// }

// export const ui = (state, getters, { user }) => user.state[year].prod.film.ui

export const newProdConfirmTableProperties = ({ converted }) => {
  if (converted)
    return [
      { name: 'ID', value: converted._id },
      { name: 'Product Name', value: converted.name },
      { name: 'Type', value: converted.type },
      { name: 'Process', value: converted.process },
      { name: 'Details:', value: htmlStrip(converted.details) },
      { name: 'Deadline', value: tToString(converted.endAt, true, 'Not assign yet', 'numeric') },
    ]
  else return []
}
