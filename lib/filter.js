var _ = require('underscore')

var filter = function(query) {
  var filters = _.keys(query)
  if (filters.length) {
    var where = '&$where='
    var clauses = []
    filters.forEach(function(filtertype) {
      var params = query[filtertype]
      if (typeof params === 'object') {
        clauses.push('(' + filtertype + '=\'' + query[filtertype].join('\' or ' + filtertype + '=\'') + '\')')
      } else {
        clauses.push('(' + filtertype + '=\'' + query[filtertype] + '\')')
      }
    })
    where += clauses.join(' and ')
    return where
  } else {
    return ''
  }
}

module.exports = filter