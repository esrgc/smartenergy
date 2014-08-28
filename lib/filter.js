var _ = require('underscore')

var filter = {
  where: function(query, notnull) {
    var filters = _.without(_.keys(query), 'group', 'tab')
    var where = '&$where='
    if (notnull) {
      notnull = '(' + notnull + ' is not null)'
    }
    if (filters.length) {
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
      if (notnull) where += ' and ' + notnull
    } else {
      if (notnull) {
        where += notnull
      } else {
        where = ''
      }
    }
    return where
  },
  group: function(query) {
    var group = ''
    if (query.group && query.group !== '') {
      group = ',' + query.group + ' as geo&$group=' + query.group
    }
    return group
  }
}

module.exports = filter