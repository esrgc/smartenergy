var _ = require('underscore')

var filter = function(query, data) {
  if (query.geo) {
    data = _.filter(data, function(d) {
      if (query.geo.indexOf(d.id) >= 0) {
        return true
      } else {
        return false
      }
    })
  }
  return data
}

module.exports = filter