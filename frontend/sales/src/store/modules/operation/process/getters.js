import groupBy from 'lodash.groupby'
import { isProcessValid, getProcessStatus } from '../../../../utils'

export const getBy_id = ({ list }) => _id => list.find(item => item._id === _id)

export const previous = ({ list }) => process => list.find(pro => pro.group === process.group && pro.level === process.level - 1)

export const group = ({ list }) => groupBy(list, 'group')

export const valids = ({ list }) => list.filter(proc => isProcessValid(proc))

export const groupByValids = (state, getters) => groupBy(getters.valids, 'group')

export const tableValues = (state, getters) => Object.entries(getters.groupByValids).reduce((pre, [group, rows]) => [...pre, ...[{ group, rows }]], [])

export const status = (state, getters) => process => {
  const { _id, level } = process
  const status = { icon: '', label: '', class: '', disabled: false, _id }
  let prevProcess
  if (level) prevProcess = getters.previous(process)
  if (level === 0 || isProcessValid(prevProcess)) {
    // const proc = list.find(p => p._id === _id)
    status.label = getProcessStatus(process)
    switch (status.label) {
      case 'Finish':
        status.icon = 'pi pi-thumbs-up'
        status.class = 'p-button-success'
        break
      case 'Started':
        status.icon = 'pi pi-reply'
        status.class = 'p-button-info'
        break
      case 'Need to start':
      case 'Locked, need to start':
        status.icon = 'pi pi-caret-right'
        status.class = 'p-button-warning'
        break
      case 'Need to assign':
        status.icon = 'pi pi-user-plus'
        status.class = 'p-button-warning'
        break
      case 'Need to filled':
        status.icon = 'pi pi-pencil'
        status.class = 'p-button-warning'
        break
      default:
        status.icon = 'pi pi-info-circle'
        status.class = 'p-button-danger'
    }
  } else {
    status.disabled = true
    status.label = 'Previous process need valid'
    status.icon = 'pi pi-exclamation-circle'
    status.class = 'p-button-warning'
  }
  return status
}

// export const getProcessStatuses = (state, getters) => {
//   const group = getters.group
//   return Object.values(group).reduce((pre, processes) => {
//     processes.map((proc, i) => {
//       const status = { icon: '', label: '', class: '', disabled: false, _id: proc._id }
//       if (i === 0 || isProcessValid(processes[i - 1])) {
//         status.label = getProcessStatus(proc)
//         switch (status.label) {
//           case 'Finish':
//             status.icon = 'pi pi-thumbs-up'
//             status.class = 'p-button-success'
//             break
//           case 'Started':
//             status.icon = 'pi pi-reply'
//             status.class = 'p-button-info'
//             break
//           case 'Need to start':
//           case 'Locked, need to start':
//             status.icon = 'pi pi-caret-right'
//             status.class = 'p-button-warning'
//             break
//           case 'Need to assign':
//             status.icon = 'pi pi-user-plus'
//             status.class = 'p-button-warning'
//             break
//           case 'Need to filled':
//             status.icon = 'pi pi-pencil'
//             status.class = 'p-button-warning'
//             break
//           default:
//             status.icon = 'pi pi-info-circle'
//             status.class = 'p-button-danger'
//         }
//       } else {
//         status.disabled = true
//         status.label = 'Previous process need valid'
//         status.icon = 'pi pi-exclamation-circle'
//         status.class = 'p-button-warning'
//       }
//       pre[proc._id] = status
//     })
//     return pre
//   }, {})
// }

export const startDate = (state, getters) => process => new Date(process.level ? getters.previous(process).end : process.start)
