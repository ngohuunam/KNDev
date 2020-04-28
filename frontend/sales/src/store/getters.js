import { objectDeep } from '../utils'

export const ui = ({ user, year }) => path => (path ? objectDeep(`state.${year}.${path}`, user).ui : {})
export const icon = state => path => (path ? objectDeep(path, state).icon : {})
export const process = ({ processes }) => _id => processes.find(pro => pro._id === _id)
