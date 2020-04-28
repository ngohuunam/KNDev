export const date = new Date()
export const year = date.getFullYear()

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

export const unixTime = time => (time ? (typeof time === 'string' ? dateToUnix(time) : time.getTime()) : 0)

export const tToString = (timestamp, addTime, nullString, yFormat) => {
  const _yFormat = yFormat || 'numeric'
  const _opt = { day: '2-digit', month: '2-digit', year: _yFormat }
  const _optAddTime = { day: '2-digit', month: '2-digit', year: _yFormat, hour: '2-digit', minute: '2-digit' }
  if (timestamp instanceof Date) return timestamp.toLocaleDateString('vi', addTime ? _optAddTime : _opt)
  // console.log(timestamp)
  if (Number.isNaN(timestamp) || timestamp < 1553048548000) return nullString
  const _newDate = new Date(timestamp)
  return _newDate.toLocaleDateString('vi', addTime ? _optAddTime : _opt)
}
