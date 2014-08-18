var _ = require('underscore')

var filter = function(query, data) {
  var filters = _.keys(query)
  filters.forEach(function(filtertype) {
    data = _.filter(data, function(d) {
      if (typeof d[filtertype] === 'undefined') {
        return true
      } else if (d[filtertype] && query[filtertype].indexOf(d[filtertype]) >= 0) {
        return true
      } else {
        return false
      }
    })
  })
  return data
}

module.exports = filter