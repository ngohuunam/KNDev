// import { construct } from './construct'
export * from './construct'
import { generateName } from './name'
// export * from './prepare-insert'
export * from './object'
export * from './parse-date'

const toProperCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

String.prototype.toProperCase = toProperCase
String.prototype.to_id = function() {
  return this.toProperCase().replace(/\s/g, '_')
}
String.prototype.insert = function(index, string) {
  if (index > 0) return this.substring(0, index) + string + this.substring(index, this.length)

  return string + this
}

export const team = ['CJHK', 'Disney', 'Local', 'UIP', 'WB']
export const produce = ['Offset Print', 'Digital Print', 'Social Media', 'Web', 'Other']
export const randomName = generateName

export const htmlStrip = html => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

export const filter_rev = (logs, start_rev) => {
  const startIndex = logs.findIndex(log => log._rev === start_rev)
  const filter = logs.slice(0, startIndex + 1)
  return filter
}

export const queryBy_id = (id, source) => {
  let _idx = -1
  const _doc = source.find(({ _id }, idx) => {
    _idx = idx
    return _id === id
  })
  return { index: _idx, doc: _doc }
}
