var express = require('express')
  , returnData = require('../lib/return-data')
  , filter = require('../lib/filter')
  , Socrata = require('../lib/Socrata')
  , async = require('async')
  , _ = require('underscore')
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
  var qry = '$select=technology,count(id) as value&$group=technology'
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

api.get('/getCapacityByCounty', function(req, res){
  var qry = '$select=county,sum(capacity)%20as%20value&$group=county'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getCapacityBySector', function(req, res){
  var qry = '$select=sector,sum(capacity)%20as%20value&$group=sector'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getSector', function(req, res){
  var qry = '$select=sector,count(id)%20as%20value&$group=sector'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getStats', function(req, res){
  var qry = '$select=sum(mea_award)%20as%20contribution,sum(total_project_cost)%20as%20project_cost,count(id)%20as%20total_projects'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getContribution', function(req, res){
  var qry = '$select=sum(mea_award)%20as%20value,county&$group=county'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getPoints', function(req, res){
  var qry = ''
  if (req.query.tab === 'renewableenergy') {
    qry = '$select=point,program_name,link,mea_award,technology'
  } else if (req.query.tab === 'energyeffiency') {
    qry = '$select=point,program_name,link,mea_award'
  } else if (req.query.tab === 'transportation') {
    qry = '$select=point,program_name,link,mea_award,vehicle_technology as technology'
  }
  qry += '&$order=id'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getStationTechnology', function(req, res){
  var qry = '$select=charging_fueling_station_technology,count(id) as value&$group=charging_fueling_station_technology'
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
  var qry = '$select=county,sum(co2_emissions_reductions_tons) as value&$group=county'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getSavings', function(req, res){
  var qry = '$select=county,sum(electricity_savings_kwh) as value&$group=county'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getCapacityOverTime', function(req, res){

  var _getCapacityForYear = function(year, callback) {
    var nextyear = year+1
    var qry = '$select=sum(capacity), \'' + year + '\' as d&$where=date<%27' + nextyear + '-01-01T12:00:00%27'
    qry += filter.where(req.query, qry)
    socrataDataset.query(qry, function(data) {
      callback(null, data)
    })
  }

  var getCapacityForYear = async.memoize(_getCapacityForYear)

  async.parallel([
    function(callback) { getCapacityForYear(2008, callback) },
    function(callback) { getCapacityForYear(2009, callback) },
    function(callback) { getCapacityForYear(2010, callback) },
    function(callback) { getCapacityForYear(2011, callback) },
    function(callback) { getCapacityForYear(2012, callback) },
    function(callback) { getCapacityForYear(2013, callback) },
    function(callback) { getCapacityForYear(2014, callback) }
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