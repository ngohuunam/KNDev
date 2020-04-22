import { order } from './assets/defaultState'

const toProperCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

String.prototype.toProperCase = toProperCase
String.prototype.to_id = function() {
  return this.toProperCase().replace(/\s/g, '')
}
String.prototype.insert = function(index, string) {
  if (index > 0) return this.substring(0, index) + string + this.substring(index, this.length)

  return string + this
}

export const date = new Date()
export const year = date.getFullYear()

export const parseInt_rev = _rev => parseInt(_rev.slice(0, _rev.indexOf('-')))

export const filter_rev = (logs, start_rev) => {
  const startIndex = logs.findIndex(log => log._rev === start_rev)
  const filter = logs.slice(0, startIndex + 1)
  return filter
}

export const pushAtSort = (array, item, compareFunction) => {
  let high = array.length - 1
  let low = 0
  let mid = 0

  while (low <= high) {
    // https://github.com/darkskyapp/binary-search
    // http://googleresearch.blogspot.com/2006/06/extra-extra-read-all-about-it-nearly.html
    mid = low + ((high - low) >> 1)
    const _cmp = compareFunction(array[mid], item)
    if (_cmp <= 0.0) {
      // searching too low
      low = mid + 1
    } else {
      // searching too high
      high = mid - 1
    }
  }

  const cmp = compareFunction(array[mid], item)
  if (cmp <= 0.0) {
    mid++
  }

  array.splice(mid, 0, item)
  return mid
}

export const queryBy_id = (id, source) => {
  let _idx = -1
  const _doc = source.find(({ _id }, idx) => {
    _idx = idx
    return _id === id
  })
  return { index: _idx, doc: _doc }
}

export const sortBy_id = (a, b) => (a._id > b._id ? 1 : b._id > a._id ? -1 : 0)

export const pushSortBy_id = (source, item) => pushAtSort(source, item, sortBy_id)

export const pushSortBy_key = (source, item, key) => pushAtSort(source, item, (a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0))
export const pushSortBy_key_des = (source, item, key) => pushAtSort(source, item, (a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0))

export const daysInMonth = (m, y) => {
  // m is 0 indexed: 0-11
  switch (m) {
    case 1:
      return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28
    case 8:
    case 3:
    case 5:
    case 10:
      return 30
    default:
      return 31
  }
}

export const dateIsValid = (dStr, mStr, yStr) => {
  const d = parseInt(dStr)
  const m = parseInt(mStr) - 1
  const y = parseInt(yStr)
  // console.log(d)
  // console.log(m)
  // console.log(y)
  return m >= 0 && m < 12 && d > 0 && d <= daysInMonth(m, y)
}

export const dateToUnix = (dateStr, hasTime) => {
  if (dateStr) {
    const _dateTimeRegexCheck = hasTime ? /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/ : /(\d{2})\/(\d{2})\/(\d{4})/
    const _regexCheck = new RegExp(_dateTimeRegexCheck)
    if (_regexCheck.test(dateStr)) {
      const parts = dateStr.match(_dateTimeRegexCheck)
      const _dStr = parts[1]
      const _mStr = parts[2]
      const _yStr = parts[3]
      if (dateIsValid(_dStr, _mStr, _yStr)) {
        const _fitTimeZoneMs = 7 * 3600 * 1000
        const _dt = (hasTime ? Date.UTC(+_yStr, _mStr - 1, +_dStr, +parts[4], +parts[5]) : Date.UTC(+_yStr, _mStr - 1, +_dStr)) - _fitTimeZoneMs
        return _dt
      }
    }
  }
  return 0
}

export const guid = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`
}

export const unixTime = time => (time ? (typeof time === 'string' ? dateToUnix(time) : time.getTime()) : 0)

export const tToString = (timestamp, addTime, nullString, yFormat) => {
  const _yFormat = yFormat ? yFormat : '2-digit'
  const _opt = { day: '2-digit', month: '2-digit', year: _yFormat }
  const _optAddTime = { day: '2-digit', month: '2-digit', year: _yFormat, hour: '2-digit', minute: '2-digit' }
  if (timestamp instanceof Date) return timestamp.toLocaleDateString('vi', addTime ? _optAddTime : _opt)
  // console.log(timestamp)
  if (Number.isNaN(timestamp) || timestamp < 1553048548000) return nullString
  const _newDate = new Date(timestamp)
  return _newDate.toLocaleDateString('vi', addTime ? _optAddTime : _opt)
}

export const htmlStrip = html => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

export const preInsert = {
  order: {
    film: _order => {
      const _newOrder = { ...order.film.new, ..._order, ...{ status: 'Created' } }
      _newOrder.foreignTitle = _newOrder.foreignTitle.toProperCase()
      _newOrder._id = _newOrder.foreignTitle.replace(/\s/g, '')
      _newOrder.vietnameseTitle = _newOrder.vietnameseTitle.toProperCase()
      _newOrder.premiereDate = unixTime(_newOrder.premiereDate)
      _newOrder.endAt = unixTime(_newOrder.endAt)
      return _newOrder
    },
  },
}

export const isObjEmpty = obj => {
  for (let key in obj) return false
  return true
}

export const objectDeep = (dotPath, obj) => dotPath.split('.').reduce((o, i) => o[i], obj)
