export default function() {
  Array.prototype.groupBy = function(k) {
    return this.reduce((acc, item) => ((acc[item[k]] = [...(acc[item[k]] || []), item]), acc), {})
  }
}
