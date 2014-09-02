var _ = require('underscore')

var filter = {
  where: function(url_query, socrata_query, notnull) {
    var filters = _.without(_.keys(url_query), 'group', 'tab')
    if (socrata_query.indexOf('where') >= 0) {
      var where = ' and '
    } else {
      var where = '&$where='
    }
    if (notnull) {
      notnull = '(' + notnull + ' is not null)'
    }
    if (filters.length) {
      var clauses = []
      filters.forEach(function(filtertype) {
        var params = url_query[filtertype]
        if (typeof params === 'object') {
          clauses.push('(' + filtertype + '=\'' + url_query[filtertype].join('\' or ' + filtertype + '=\'') + '\')')
        } else {
          clauses.push('(' + filtertype + '=\'' + url_query[filtertype] + '\')')
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