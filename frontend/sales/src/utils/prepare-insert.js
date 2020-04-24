import { construct } from './construct'
import orderSchema from '../store/modules/order/schema'
import { unixTime } from './parse-date'

export const prepareInsert = {
  order: {
    film: _order => {
      const _newOrder = { ...construct(orderSchema.film), ..._order, ...{ status: 'Created' } }
      _newOrder.foreignTitle = _newOrder.foreignTitle.toProperCase()
      _newOrder._id = _newOrder.foreignTitle.replace(/\s/g, '_')
      _newOrder.vietnameseTitle = _newOrder.vietnameseTitle.toProperCase()
      _newOrder.premiereDate = unixTime(_newOrder.premiereDate)
      _newOrder.endAt = unixTime(_newOrder.endAt)
      return _newOrder
    },
  },
}
