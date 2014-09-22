var express = require('express')
  , returnData = require('../lib/return-data')
  , filter = require('../lib/filter')
  , Socrata = require('../lib/Socrata')
  , async = require('async')
  , _ = require('lodash')
  , config = require('../config/config')

var socrataDataset = new Socrata.Dataset()
socrataDataset.setHost('https://data.maryland.gov')
socrataDataset.setAppToken(config.socrata.apptoken)
socrataDataset.setUID(config.socrata.uid)
socrataDataset.setCredentials(config.socrata.user, config.socrata.password)

var api = new express.Router()

/* Return dummy data */

api.use(function(req, res, next) {
  if (req.query.tab) {
    socrataDataset.setUID(config.socrata.uids[req.query.tab])
    next()
  } else {
    res.json({error: 'Must send tab paramater'})
  }
  req.on('close', function() {
    if (req.socrata_req) req.socrata_req.abort()
  })
})

api.get('/getTechnology', function(req, res){
  var qry = '$select=technology,count(id) as projects&$group=technology'
  qry += filter.where(req.query, qry, 'technology')
  req.socrata_req = socrataDataset.query(qry,function(data) {
    returnData(req, res, data)
  })
})

api.get('/getProgramType', function(req, res){
  var qry = '$select=program_type,count(id) as value&$group=program_type'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getProgramName', function(req, res){
  var qry = '$select=program_name,count(id) as projects&$group=program_name'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    var d = []
    _.each(data, function(r) {
      d.push({
        "Program Name": r.program_name,
        "projects": r.projects
      })
    })
    returnData(req, res, d)
  })
})

api.get('/getCapacityByCounty', function(req, res){
  var qry = '$select=county,sum(capacity)&$group=county'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    var d = []
    _.each(data, function(r) {
      d.push({
        county: r.county,
        "Capacity": r.sum_capacity
      })
    })
    returnData(req, res, d)
  })
})

api.get('/getCapacityBySector', function(req, res){
  var qry = '$select=sector,sum(capacity)&$group=sector'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    var d = []
    _.each(data, function(r) {
      d.push({
        sector: r.sector,
        "Capacity": r.sum_capacity
      })
    })
    returnData(req, res, d)
  })
})

api.get('/getSector', function(req, res){
  var qry = '$select=sector,count(id)%20as%20projects&$group=sector'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getStats', function(req, res){
  var qry = '$select=sum(mea_award)%20as%20contribution,sum(total_project_cost)%20as%20project_cost,sum(other_agency_dollars),count(id)%20as%20total_projects'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getContribution', function(req, res){
  var qry = '$select=sum(mea_award)%20as%20mea_contribution,sum(total_project_cost)%20as%20project_cost,county&$group=county'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    var d = []
    _.each(data, function(r) {
      d.push({
        county: r.county,
        "Total Project Cost": +r.project_cost - +r.mea_contribution,
        "MEA Contribution": +r.mea_contribution
      })
    })
    returnData(req, res, d)
  })
})

api.get('/getPoints', function(req, res){
  var data = []
    , limit = 10000
    , offset = 0
    , qry = ''
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
      req.socrata_req = socrataDataset.query(_qry, function(_data) {
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
})

api.get('/getProjectsByPoint', function(req, res){
  var qry = ''

  if (req.query.tab === 'renewableenergy') {
    qry = '$select=point,program_name,project_name,other_agency_dollars,total_project_cost,capacity,capacity_units,notes,link,mea_award,technology'
  } else if (req.query.tab === 'energyeffiency') {
    qry = '$select=point,program_name,link,mea_award,notes'
  } else if (req.query.tab === 'transportation') {
    qry = '$select=point,program_name,link,mea_award,charging_fueling_station_technology as technology,notes'
  }
  qry += '&$order=id&$limit=10000'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getStationTechnology', function(req, res){
  var qry = '$select=charging_fueling_station_technology as technology,count(id) as projects&$group=charging_fueling_station_technology'
  qry += filter.where(req.query, qry, 'charging_fueling_station_technology')
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getVehicleTechnology', function(req, res){
  var qry = '$select=vehicle_technology,count(id) as value&$group=vehicle_technology'
  qry += filter.where(req.query, qry, 'vehicle_technology')
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getReductions', function(req, res){
  var qry = '$select=county,sum(co2_emissions_reductions_tons) as reduction&$group=county'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getSavings', function(req, res){
  var qry = '$select=county,sum(electricity_savings_kwh) as savings&$group=county'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getCapacityOverTime', function(req, res){

  var _getPerYear = function(year, callback) {
    var nextyear = year+1
    var qry = '$select=sum(capacity), \'' + year + '\' as year&$where=date>%27' + year + '-01-01T12:00:00%27  and date<%27' + nextyear + '-01-01T12:00:00%27 '
    qry += filter.where(req.query, qry)
    socrataDataset.query(qry, function(data) {
      callback(null, data)
    })
  }

  var getPerYear = async.memoize(_getPerYear)

  async.parallel([
    function(callback) { getPerYear(2008, callback) },
    function(callback) { getPerYear(2009, callback) },
    function(callback) { getPerYear(2010, callback) },
    function(callback) { getPerYear(2011, callback) },
    function(callback) { getPerYear(2012, callback) },
    function(callback) { getPerYear(2013, callback) },
    function(callback) { getPerYear(2014, callback) }
  ], function(err, results) {
    var data = _.flatten(results)
    var d = []
    _.each(data, function(r) {
      d.push({
        year: r.year,
        "Capacity": r.sum_capacity
      })
    })
    returnData(req, res, d)
  })
})

api.get('/getReductionOverTime', function(req, res){

  var _getPerYear = function(year, callback) {
    var nextyear = year+1
    var qry = '$select=sum(co2_emissions_reductions_tons) as reduction, \'' + year + '\' as year&$where=date>%27' + year + '-01-01T12:00:00%27  and date<%27' + nextyear + '-01-01T12:00:00%27 '
    qry += filter.where(req.query, qry)
    socrataDataset.query(qry, function(data) {
      callback(null, data)
    })
  }

  var getPerYear = async.memoize(_getPerYear)

  async.parallel([
    function(callback) { getPerYear(2008, callback) },
    function(callback) { getPerYear(2009, callback) },
    function(callback) { getPerYear(2010, callback) },
    function(callback) { getPerYear(2011, callback) },
    function(callback) { getPerYear(2012, callback) },
    function(callback) { getPerYear(2013, callback) },
    function(callback) { getPerYear(2014, callback) }
  ], function(err, results) {
    var data = _.flatten(results)
    returnData(req, res, data)
  })
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