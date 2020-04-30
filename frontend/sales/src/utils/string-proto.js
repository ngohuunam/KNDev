export default function() {
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
}
