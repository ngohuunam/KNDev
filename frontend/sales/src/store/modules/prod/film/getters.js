import { tToString, htmlStrip } from '@/tools'

export const newProdConfirmTableProperties = () => converted => {
  if (converted)
    return [
      { name: 'ID', value: converted._id },
      { name: 'Product Name', value: converted.name },
      { name: 'Type', value: converted.type },
      { name: 'Details:', value: htmlStrip(converted.details) },
      { name: 'Deadline', value: tToString(converted.endAt, true, 'Not assign yet', 'numeric') },
    ]
  else return []
}
