import { construct as _construct } from '../../../utils'
import schema from './schema'

export const construct = () => col => {
  console.log(col)
  return _construct(schema[col])
}
