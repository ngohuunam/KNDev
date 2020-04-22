export default {
  rxdb: true,
  prototypes: {
    RxDocument: proto => {
      proto.update = function({ update, type, note }) {
        const oldDocData = this._data
        const newDocData = { ...do_update(oldDocData, update), ...{ type, note, update } }
        console.log('(update) newDocData', newDocData)
        return this._saveData(newDocData, oldDocData)
      }
    },
    RxQuery: proto => {
      proto.update = function(updateObj) {
        console.log('(update) updateObj', updateObj)
        return this.exec().then(docs => {
          if (!docs) return null
          if (Array.isArray(docs)) return Promise.all(docs.map(doc => doc.update(updateObj))).then(() => docs)
          return docs.update(updateObj).then(() => docs)
        })
      }
    },
  },
}

const do_update = (target, updateObj) => {
  const clone = { ...target }
  Object.entries(updateObj).map(([op, fields]) => {
    console.log('(update) target', target)
    MODIFIER[op](clone, fields)
    console.log('(update) clone', clone)
  })
  return clone
}

const MODIFIER = {
  /* updateObj: { $now: {'createdAt': 'now', 'dropped': 'now'} } */
  $now: function(target, fields) {
    fields.map(field => (target[field] = Date.now()))
  },
  $set: function(target, fields) {
    Object.entries(fields).map(([field, value]) => (target[field] = value))
  },
  /* updateObj: { $spliceAt: { products: 0 }} */
  // $spliceAt: function(target, fields) {
  //   Object.entries(fields).map(([field, index]) => {
  //     checkArray(target, field, '$spliceAt')
  //     target[field].splice(index, 1)
  //   })
  // },
  /* updateObj: { $replaceAt: { products: { $index: 0, $value: 'replace product id' }}} */
  // $replaceAt: function(target, fields) {
  //   Object.entries(fields).map(([field, { $index, $value }]) => {
  //     checkArray(target, field, '$replaceAt')
  //     target[field].splice($index, 1, $value)
  //   })
  // },
  /* updateObj: { $insertAt: { products: { $index: 0, $value: 'insert product id' }}} */
  // $insertAt: function(target, fields) {
  //   Object.entries(fields).map(([field, { $index, $value }]) => {
  //     checkArray(target, field, '$insertAt')
  //     target[field].splice($index, 0, $value)
  //   })
  // },
  /* updateObj: { $push: { products: 'new product name'}} */
  // $push: function(target, fields) {
  //   Object.entries(fields).map(([field, value]) => {
  //     checkArray(target, field, '$push')
  //     target[field].push(value)
  //   })
  // },
  /* updateObj: { $unshift: { products: 'new product name'}} */
  $unshift: function(target, fields) {
    Object.entries(fields).map(([field, value]) => {
      checkArray(target, field, '$unshift')
      target[field].unshift(value)
    })
  },
}

const checkArray = (target, field, op) => {
  if (target[field] === undefined) target[field] = []
  if (!(target[field] instanceof Array)) throw new Error(`Cannot apply ${op} to non-array ${field}`)
}
