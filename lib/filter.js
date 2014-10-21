var _ = require('lodash')

var filter = {
  conditions: function(url_query, notnull) {
    var filters = _.without(_.keys(url_query), 'group', 'tab', 'geotype', 'csv')
    var conditions = {}
    if (notnull) {
      conditions[notnull] = {$exists: true}
    }
    if (filters.length) {
      filters.forEach(function(filtertype) {
        var params = url_query[filtertype]
        if (typeof params === 'object') {
          conditions[filtertype] = {$in: params}
        } else {
          conditions[filtertype] = params
        }
      })
    }
    return conditions
  },
  where: function(url_query, socrata_query, notnull) {
    var filters = _.without(_.keys(url_query), 'group', 'tab', 'geotype')
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
          params = params.map(function(p) {
            return p.replace("'", "''")
          })
          clauses.push('(' + filtertype + '=\'' + params.join('\' or ' + filtertype + '=\'') + '\')')
        } else {
          params = params.replace("'", "''")
          console.log(params)
          clauses.push('(' + filtertype + '=\'' + params + '\')')
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
  },
  geotype: function(query) {
    var geotype = query.geotype || 'state'
    var qry = ''
    if (geotype !== 'state' && geotype) {
      qry += ',' + geotype + '&$group=' + geotype
    }
    return qry
  }
}

module.exports = filter