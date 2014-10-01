var express = require('express')
  , returnData = require('../lib/return-data')
  , filter = require('../lib/filter')
  , Socrata = require('../lib/Socrata')
  , async = require('async')
  , _ = require('lodash')
  , config = require('../config/config')
  , mongo = require('../lib/mongo')

var socrataDataset = new Socrata.Dataset()
socrataDataset.setHost('https://data.maryland.gov')
socrataDataset.setAppToken(config.socrata.apptoken)
socrataDataset.setUID(config.socrata.uid)
socrataDataset.setCredentials(config.socrata.user, config.socrata.password)

var CACHE = true

function addGeoType(obj, geotype, row) {
  if (geotype === 'state' || !geotype || typeof geotype === 'undefined') {
    obj['state'] = 'Maryland'
  } else {
    obj[geotype] = row[geotype]
  }
  return obj
}

var api = new express.Router()

api.use(function(req, res, next) {
  if (CACHE) {
    console.log(req.url)
    next()
  } else {
    if (req.query.tab) {
      socrataDataset.setUID(config.socrata.uids[req.query.tab])
      next()
    } else {
      res.json({error: 'Must send tab paramater'})
    }
    req.on('close', function() {
      if (req.socrata_req) req.socrata_req.abort()
    })
  }
})

api.get('/getTechnology', function(req, res){
  function handleData(err, data) {
    data = _.map(data, function(r) {
      return {
        'Technology': r.technology,
        'Projects': r.projects
      }
    })
    returnData(req, res, data)
  }
  if (CACHE) {
    var conditions = filter.conditions(req.query)
    req.cursor = mongo.db.collection(req.query.tab).group(['technology'], conditions, {"projects":0}, "function (obj, prev) { prev.projects++; }", handleData)
  } else {
    var qry = '$select=technology,count(id) as projects&$group=technology'
    qry += filter.where(req.query, qry, 'technology')
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
})

api.get('/getProgramType', function(req, res){
  var qry = '$select=program_type,count(id) as value&$group=program_type'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(err, data) {
    returnData(req, res, data)
  })
})

api.get('/getProgramName', function(req, res){
  function handleData(err, data) {
    data = _.map(data, function(r) {
      return {
        'Program Name': r.program_name,
        'Projects': r.projects,
        'Contribution': r.contribution
      }
    })
    returnData(req, res, data)
  }
  if (CACHE) {
    var conditions = filter.conditions(req.query)
    var sums = {
      'projects':0,
      'contribution': 0
    }
    var aggregate = function (obj, prev) {
      prev.projects++;
      prev.contribution += +obj.mea_award || 0
    }
    mongo.db.collection(req.query.tab).group(['program_name'], conditions, sums, aggregate, handleData)
  } else {
    var qry = '$select=program_name,count(id) as projects&$group=program_name'
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
})

api.get('/getCapacityByArea', function(req, res){
  function handleData(err, data) {
    var d = []
    data = _.map(data, function(r) {
      var obj =  {
        'Capacity': r.sum_capacity
      }
      return addGeoType(obj, req.query.geotype, r)
    })
    returnData(req, res, data)
  }
  if (CACHE) {
    var conditions = filter.conditions(req.query)
    if (req.query.geotype) {
      var group = [req.query.geotype]
    } else {
      var group = []
    }
    var aggregate = function (obj, prev) {
      prev.sum_capacity += +obj.capacity || 0
    }
    mongo.db.collection(req.query.tab).group([group], conditions, {"sum_capacity":0}, aggregate, handleData)
  } else {
    var qry = '$select=sum(capacity)'
    qry += filter.geotype(req.query)
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
})

api.get('/getCapacityBySector', function(req, res){
  function handleData(err, data) {
    data = _.map(data, function(r) {
      return {
        'Sector': r.sector,
        'Capacity': r.sum_capacity
      }
    })
    returnData(req, res, data)
  }
  if (CACHE) {
    var conditions = filter.conditions(req.query)
    var aggregate = function (obj, prev) { prev.sum_capacity += +obj.capacity || 0; }
    mongo.db.collection(req.query.tab).group(['sector'], conditions, {"sum_capacity":0}, aggregate, handleData)
  } else {
    var qry = '$select=sector,sum(capacity)&$group=sector'
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
})

api.get('/getSector', function(req, res){
  function handleData(err, data) {
    data = _.map(data, function(r) {
      return {
        'Sector': r.sector,
        'Projects': r.projects,
        'Contribution': r.contribution
      }
    })
    returnData(req, res, data)
  }
  if (CACHE) {
    var conditions = filter.conditions(req.query)
    var sums = {
      'projects':0,
      'contribution': 0
    }
    var aggregate = function (obj, prev) {
      prev.projects++;
      prev.contribution += +obj.mea_award || 0
    }
    setTimeout(function() {
      mongo.db.collection(req.query.tab).group(['sector'], conditions, sums, aggregate, handleData)
    }, 5000)
  } else {
    var qry = '$select=sector,count(id)%20as%20projects&$group=sector'
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
})

api.get('/getStats', function(req, res){
  function handleData(err, data) {
    returnData(req, res, data)
  }
  if (CACHE) {
    var conditions = filter.conditions(req.query)
    var aggregate = function (obj, prev) {
      prev.contribution += (+obj.mea_award || 0);
      prev.project_cost += (+obj.total_project_cost || 0);
      prev.total_projects++;
    }
    mongo.db.collection(req.query.tab).group([], conditions, {contribution:0, project_cost: 0, total_projects: 0}, aggregate, handleData)
  } else {
    var qry = '$select=sum(mea_award)%20as%20contribution,sum(total_project_cost)%20as%20project_cost,sum(other_agency_dollars),count(id)%20as%20total_projects'
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, function(err, data) {
      returnData(req, res, data)
    })
  }
})

api.get('/getContribution', function(req, res){
  function handleData(err, data) {
    data = _.map(data, function(r) {
      var obj = {
        'MEA Contribution': +r.mea_contribution,
        'Total Project Cost': +r.project_cost,
        'Other Agency Dollars': +r.sum_other_agency_dollars
      }
      if (+r.project_cost > 0) {
        obj['Other Contributions'] = +r.project_cost - +r.mea_contribution - +r.sum_other_agency_dollars
      } else {
        obj['Other Contributions'] = 0
      }
      return addGeoType(obj, req.query.geotype, r)
    })
    returnData(req, res, data)
  }
  if (CACHE) {
    var conditions = filter.conditions(req.query)
    if (req.query.geotype) {
      var group = [req.query.geotype]
    } else {
      var group = []
    }
    var aggregate = function (obj, prev) {
      prev.mea_contribution += +obj.mea_award || 0
      prev.project_cost += +obj.total_project_cost || 0
      prev.sum_other_agency_dollars += +obj.sum_other_agency_dollars || 0
    }
    var sums = {
      project_cost: 0,
      mea_contribution:0,
      sum_other_agency_dollars: 0
    }
    mongo.db.collection(req.query.tab).group([group], conditions, sums, aggregate, handleData)
  } else {
    var qry = '$select=sum(mea_award)%20as%20mea_contribution,sum(other_agency_dollars) as sum_other_agency_dollars, sum(total_project_cost)%20as%20project_cost'
    qry += filter.geotype(req.query)
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
})

api.get('/getPoints', function(req, res){
  var data = []
    , limit = 10000
    , offset = 0
    , qry = ''
  if (CACHE) {
    var technology_field = 'technology'
    if (req.query.tab === 'energyeffiency') {
      technology_field = 'program_name'
    }
    if (req.query.tab === 'renewableenergy') {
      technology_field = 'technology'
    } else if (req.query.tab === 'energyeffiency') {
      technology_field = 'program_name'
    } else if (req.query.tab === 'transportation') {
      technology_field = 'charging_fueling_station_technology'
    }

    var conditions = filter.conditions(req.query, 'point')
    var cursor = mongo.db.collection(req.query.tab).find(conditions)
    cursor.toArray(function(err, data) {
      var points = _.groupBy(data, 'point')
      var response = { points: [] }
      for (var p in points) {
        var obj = {
          point: p,
          projects: points[p].length
        }
        if (req.query.tab === 'energyeffiency') {
          obj.projects = points[p].length
        } else {
          if (points[p].length === 1) {
            obj.technology = points[p][0][technology_field]
          }
        }
        response.points.push(obj)
      }
      returnData(req, res, response)
    })
  } else {
    if (req.query.tab === 'renewableenergy') {
      qry = '$select=point,technology&$order=id%20desc'
    } else if (req.query.tab === 'energyeffiency') {
      qry = '$select=point&$order=id%20desc'
    } else if (req.query.tab === 'transportation') {
      qry = '$select=point,charging_fueling_station_technology as technology&$order=id%20desc'
    }
    qry += '&$limit=' + limit
    qry += filter.where(req.query, qry, 'point')
    async.whilst(
      function() { return limit == 10000 },
      function(next) {
        var _qry = qry + '&$offset=' + offset
        req.socrata_req = socrataDataset.query(_qry, function(err, _data) {
          data = data.concat(_data)
          limit = _data.length
          offset += 10000
          next()
        })
      },
      function(err) {
        var points = _.groupBy(data, 'point')
        var response = { points: [] }
        for (var p in points) {
          response.points.push({
            point: p,
            projects: _.pluck(points[p], 'technology')
          })
        }
        returnData(req, res, response)
      }
    )
  }
})

api.get('/getProjectsByPoint', function(req, res){
  var qry = ''

  if (CACHE) {
    if (req.query.tab === 'renewableenergy') {
      technology_field = 'technology'
    } else if (req.query.tab === 'energyeffiency') {
      technology_field = 'program_name'
    } else if (req.query.tab === 'transportation') {
      technology_field = 'charging_fueling_station_technology'
    }
    var conditions = filter.conditions(req.query)
    mongo.db.collection(req.query.tab).find(conditions).toArray(function(err, data) {
      data = _.map(data, function(r) {
        if (r.charging_fueling_station_technology) {
          r.technology = r.charging_fueling_station_technology
        } else if (r.vehicle_technology) {
          r.technology = r.vehicle_technology
        }
        return r
      })
      returnData(req, res, data)
    })
  } else {
    if (req.query.tab === 'renewableenergy') {
      qry = '$select=point,program_name,project_name,other_agency_dollars,total_project_cost,capacity,capacity_units,notes,link,mea_award,technology'
    } else if (req.query.tab === 'energyeffiency') {
      qry = '$select=point,program_name,link,mea_award,notes'
    } else if (req.query.tab === 'transportation') {
      qry = '$select=point,program_name,link,mea_award,charging_fueling_station_technology as technology,notes'
    }
    qry += '&$order=id&$limit=10000'
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, function(err, data) {
      returnData(req, res, data)
    })
  }
})

api.get('/getStationTechnology', function(req, res){
  function handleData(err, data) {
    data = _.map(data, function(r) {
      return {
        'Technology': r.charging_fueling_station_technology,
        'Projects': +r.projects
      }
    })
    returnData(req, res, data)
  }
  if (CACHE) {
    var conditions = filter.conditions(req.query)
    mongo.db.collection(req.query.tab).group(['charging_fueling_station_technology'], conditions, {"projects":0}, "function (obj, prev) { prev.projects++; }", handleData)
  } else {
    var qry = '$select=charging_fueling_station_technology,count(id) as projects&$group=charging_fueling_station_technology'
    qry += filter.where(req.query, qry, 'charging_fueling_station_technology')
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
})

api.get('/getVehicleTechnology', function(req, res){
  var qry = '$select=vehicle_technology,count(id) as value&$group=vehicle_technology'
  qry += filter.where(req.query, qry, 'vehicle_technology')
  req.socrata_req = socrataDataset.query(qry, function(err, data) {
    returnData(req, res, data)
  })
})

api.get('/getReductions', function(req, res){
  function handleData(err, data) {
    data = _.map(data, function(r) {
      var obj = {
        'Reduction': +r.reduction
      }
      return addGeoType(obj, req.query.geotype, r)
    })
    returnData(req, res, data)
  }

  if (CACHE) {
    var conditions = filter.conditions(req.query)
    if (req.query.geotype) {
      var group = [req.query.geotype]
    } else {
      var group = []
    }
    var aggregate = function (obj, prev) {
      prev.reduction += (+obj.co2_emissions_reductions_tons || 0);
    }
    mongo.db.collection(req.query.tab).group(group, conditions, {reduction:0}, aggregate, handleData)
  } else {
    var qry = '$select=sum(co2_emissions_reductions_tons) as reduction'
    qry += filter.geotype(req.query)
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
})

api.get('/getSavings', function(req, res){
  function handleData(err, data) {
      data = _.map(data, function(r) {
        var obj = {
          'Savings': +r.savings
        }
        return addGeoType(obj, req.query.geotype, r)
      })
      returnData(req, res, data)
    }

  if (CACHE) {
    var conditions = filter.conditions(req.query)
    if (req.query.geotype) {
      var group = [req.query.geotype]
    } else {
      var group = []
    }
    var aggregate = function (obj, prev) {
      prev.savings += (+obj.electricity_savings_kwh || 0);
    }
    mongo.db.collection(req.query.tab).group(group, conditions, {savings:0}, aggregate, handleData)
  } else {
    var qry = '$select=sum(electricity_savings_kwh) as savings'
    qry += filter.geotype(req.query)
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
})

api.get('/getCapacityOverTime', function(req, res){

  function handleData(err, results) {
    var data = _.flatten(results)
    data = _.map(data, function(r) {
      return {
        'Year': r.year,
        'Capacity': r.sum_capacity || 0
      }
    })
    returnData(req, res, data)
  }

  if (CACHE) {
    var getPerYear = function(year, callback) {
      var conditions = filter.conditions(req.query)
      conditions.date = {$gt: year + '-01-01T12:00:00', $lt: year+1 + '-01-01T12:00:00'}
      var aggregate = function (obj, prev) {
        prev.sum_capacity += (+obj.capacity || 0);
      }
      mongo.db.collection(req.query.tab).group([], conditions, {sum_capacity:0}, aggregate, function(err, data) {
        data[0].year = year.toString()
        callback(err, data)
      })
    }
  } else {
  var getPerYear = function(year, callback) {
    var nextyear = year+1
    var qry = '$select=sum(capacity), \'' + year + '\' as year&$where=date>%27' + year + '-01-01T12:00:00%27  and date<%27' + nextyear + '-01-01T12:00:00%27 '
    qry += filter.where(req.query, qry)
    socrataDataset.query(qry, function(err, data) {
      callback(null, data)
    })
  }
  }

  async.parallel([
    function(callback) { getPerYear(2008, callback) },
    function(callback) { getPerYear(2009, callback) },
    function(callback) { getPerYear(2010, callback) },
    function(callback) { getPerYear(2011, callback) },
    function(callback) { getPerYear(2012, callback) },
    function(callback) { getPerYear(2013, callback) },
    function(callback) { getPerYear(2014, callback) }
  ], handleData)
})

api.get('/getReductionOverTime', function(req, res){

  function handleData(err, results) {
    var data = _.flatten(results)
    data = _.map(data, function(r) {
      return {
        'Year': r.year,
        'Reduction': r.reduction || 0,
      }
    })
    returnData(req, res, data)
  }

  if (CACHE) {
    var getPerYear = function(year, callback) {
      var conditions = filter.conditions(req.query)
      conditions.date = {$gt: year + '-01-01T12:00:00', $lt: year+1 + '-01-01T12:00:00'}
      var aggregate = function (obj, prev) {
        prev.reduction += (+obj.co2_emissions_reductions_tons || 0);
      }
      mongo.db.collection(req.query.tab).group([], conditions, {reduction:0}, aggregate, function(err, data) {
        data[0].year = year.toString()
        callback(err, data)
      })
    }
  } else {
    var _getPerYear = function(year, callback) {
      var nextyear = year+1
      var qry = '$select=sum(co2_emissions_reductions_tons) as reduction, \'' + year + '\' as year&$where=date>%27' + year + '-01-01T12:00:00%27  and date<%27' + nextyear + '-01-01T12:00:00%27 '
      qry += filter.where(req.query, qry)
      socrataDataset.query(qry, function(err, data) {
        callback(null, data)
      })
    }

    var getPerYear = async.memoize(_getPerYear)
  }
  async.parallel([
    function(callback) { getPerYear(2008, callback) },
    function(callback) { getPerYear(2009, callback) },
    function(callback) { getPerYear(2010, callback) },
    function(callback) { getPerYear(2011, callback) },
    function(callback) { getPerYear(2012, callback) },
    function(callback) { getPerYear(2013, callback) },
    function(callback) { getPerYear(2014, callback) }
  ], handleData)
})

api.get('/getPieData', function(req, res){
  var data = [
    {geo: "Allegany", value: 500},
    {geo: "Anne Arundel", value: 7300},
    {geo: "Baltimore", value: 8000},
    {geo: "Baltimore City", value: 2720},
    {geo: "Calvert", value: 1142},
    {geo: "Prince George's", value: 3000},
    {geo: "Queen Anne's", value: 400},
    {geo: "Somerset", value: 100},
    {geo: "St. Mary's", value: 1100},
    {geo: "Talbot", value: 500},
    {geo: "Washington", value: 760},
    {geo: "Wicomico", value: 500},
    {geo: "Worcester", value: 500}
  ]
  //var data = filter.where(req.query, data)
  returnData(req, res, data)
})

api.get('/getPieData2', function(req, res){
  var data = [
    {geo: "Allegany", value: 20},
    {geo: "Anne Arundel", value: 300},
    {geo: "Baltimore", value: 400},
    {geo: "Baltimore City", value: 20},
    {geo: "Worcester", value: 50}
  ]
  //var data = filter.where(req.query, data)
  returnData(req, res, data)
})

module.exports = api