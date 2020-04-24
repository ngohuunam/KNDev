// import { construct } from './construct'
export * from './construct'
import { generateName as randomName } from './name'
export * from './prepare-insert'
export * from './object'
export * from './parse-date'

const team = ['CJHK', 'Disney', 'Local', 'UIP', 'WB']
const produce = ['Offset Print', 'Digital Print', 'Social Media', 'Web', 'Other']

export { team, produce, randomName }
