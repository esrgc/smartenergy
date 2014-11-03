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
        'Projects': r.projects,
        'Contribution': r.contribution
      }
    })
    returnData(req, res, data)
  }
  if (CACHE) {
    var conditions = filter.conditions(req.query)
    mongo.db.collection(req.query.tab).aggregate(
      {$match: conditions},
      {$project: {technology: 1, mea_award: 1}},
      {$group: {_id: {technology: '$technology'}, projects:{$sum: 1}, contribution: {$sum: '$mea_award'}}},
      {$project: {_id: 0,technology: "$_id.technology", projects: 1, contribution: 1}},
      {$sort: {projects: -1}}, handleData)
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
    mongo.db.collection(req.query.tab).aggregate(
      {$match: conditions},
      {$project: {program_name: 1, mea_award: 1}},
      {$group: {_id: {program_name: '$program_name'}, projects:{$sum: 1}, contribution: {$sum: '$mea_award'}}},
      {$project: {_id: 0,program_name: "$_id.program_name", projects: 1, contribution: 1}},
      {$sort: {projects: -1}}, handleData)
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
    var id = null
    var project = {_id: 0, sum_capacity: 1}
    if (req.query.geotype) {
      var id = {}
      id[req.query.geotype] =  '$' + req.query.geotype
      project[req.query.geotype] = '$_id.' + req.query.geotype
    }
    mongo.db.collection(req.query.tab).aggregate(
      {$match: conditions},
      {$group: {
        _id: id,
        sum_capacity: {$sum: '$capacity'}
      }},
      {$project: project},
      handleData)
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
    mongo.db.collection(req.query.tab).aggregate(
      {$match: conditions},
      {$project: {capacity: 1, sector: 1}},
      {$group: {_id: {sector: '$sector'}, sum_capacity: {$sum: '$capacity'}}},
      {$project: {_id: 0,sector: "$_id.sector", sum_capacity: 1}},
      handleData)
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
    mongo.db.collection(req.query.tab).aggregate(
      {$match: conditions},
      {$project: {sector: 1, mea_award: 1}},
      {$group: {_id: {sector: '$sector'}, projects:{$sum: 1}, contribution: {$sum: '$mea_award'}}},
      {$project: {_id: 0,sector: "$_id.sector", projects: 1, contribution: 1}},
      {$sort: {projects: -1}}, handleData)
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
    mongo.db.collection(req.query.tab).aggregate(
      {$match: conditions},
      {$project: {mea_award: 1, other_agency_dollars: 1,
        total_project_cost: {
          $cond: [
            {$gt: ['$total_project_cost', 0]},
            '$total_project_cost',
            {$add: ['$mea_award', '$other_agency_dollars']}
          ]
        }
      }},
      {$group: {
        _id: null,
        total_projects:{$sum: 1},
        project_cost: {$sum: '$total_project_cost'},
        contribution: {$sum: '$mea_award'},
        sum_other_agency_dollars: {$sum: '$other_agency_dollars'}
      }},
      {$project: {_id: 0, total_projects: 1, project_cost: 1, contribution: 1, sum_other_agency_dollars: 1}},
      handleData)
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
        'MEA Contribution': r.mea_contribution,
        'Total Project Cost': r.project_cost,
        'Other Agency Dollars': r.sum_other_agency_dollars
      }
      if (r.project_cost > 0) {
        obj['Other Contributions'] = r.project_cost - r.mea_contribution - r.sum_other_agency_dollars
      } else {
        obj['Other Contributions'] = 0
      }
      return addGeoType(obj, req.query.geotype, r)
    })
    returnData(req, res, data)
  }
  if (CACHE) {
    var conditions = filter.conditions(req.query)
    var id = null
    var project_in = {mea_award: 1, other_agency_dollars: 1,
      total_project_cost: {
        $cond: [
          {$gt: ['$total_project_cost', 0]},
          '$total_project_cost',
          {$add: ['$mea_award', '$other_agency_dollars']}
        ]
      }
    }
    var project_out = {_id: 0, projects: 1, mea_contribution: 1, project_cost: 1, sum_other_agency_dollars: 1}
    if (req.query.geotype) {
      var id = {}
      id[req.query.geotype] =  '$' + req.query.geotype
      project_in[req.query.geotype] = 1
      project_out[req.query.geotype] = '$_id.' + req.query.geotype
    }
    mongo.db.collection(req.query.tab).aggregate(
      {$match: conditions},
      {$project: project_in},
      {$group: {
        _id: id,
        projects:{$sum: 1},
        mea_contribution: {$sum: '$mea_award'},
        project_cost: {$sum: '$total_project_cost'},
        sum_other_agency_dollars: {$sum: '$other_agency_dollars'}
      }},
      {$project: project_out},
      {$sort: {projects: -1}}, handleData)
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
    if (req.query.tab === 'renewable') {
      technology_field = 'technology'
    } else if (req.query.tab === 'efficiency') {
      technology_field = 'sector'
    } else if (req.query.tab === 'transportation') {
      technology_field = 'charging_fueling_station_technology'
    }

    var conditions = filter.conditions(req.query, 'point')
    var project = {point: 1, _id: 0}
    project[technology_field] = 1
    var cursor = mongo.db.collection(req.query.tab).find(conditions, project)
    cursor.toArray(function(err, data) {
      var points = _.groupBy(data, 'point')
      var response = { points: [] }
      for (var p in points) {
        var obj = {
          point: p,
          projects: points[p].length
        }
        var techs = _.filter(_.uniq(_.pluck(points[p], technology_field)), null)
        var techcount = []
        techs.forEach(function(tech) {
          var where = {}
          where[technology_field] = tech
          var x = {t: tech}
          x.p = _.where(points[p], where).length
          techcount.push(x)
        })
        obj.techcount = techcount
        response.points.push(obj)
      }
      returnData(req, res, response)
    })
  } else {
    if (req.query.tab === 'renewable') {
      qry = '$select=point,technology&$order=id%20desc'
    } else if (req.query.tab === 'efficiency') {
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
    if (req.query.tab === 'renewable') {
      technology_field = 'technology'
    } else if (req.query.tab === 'efficiency') {
      technology_field = 'sector'
    } else if (req.query.tab === 'transportation') {
      technology_field = 'charging_fueling_station_technology'
    }
    var tech = req.query.tech
    delete req.query.tech
    var conditions = filter.conditions(req.query)
    conditions[technology_field] = tech
    mongo.db.collection(req.query.tab).find(conditions).toArray(function(err, data) {
      data = _.map(data, function(r) {
        if (r.charging_fueling_station_technology) {
          r.technology = r.charging_fueling_station_technology
        }
        return r
      })
      returnData(req, res, data)
    })
  } else {
    if (req.query.tab === 'renewable') {
      qry = '$select=point,program_name,project_name,other_agency_dollars,total_project_cost,capacity,capacity_units,notes,link,mea_award,technology'
    } else if (req.query.tab === 'efficiency') {
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
        'Projects': r.projects
      }
    })
    returnData(req, res, data)
  }
  if (CACHE) {
    var conditions = filter.conditions(req.query, 'charging_fueling_station_technology')
    mongo.db.collection(req.query.tab).aggregate(
      {$match: conditions},
      {$project: {charging_fueling_station_technology: 1}},
      {$group: {_id: {charging_fueling_station_technology: '$charging_fueling_station_technology'}, projects: {$sum: 1}}},
      {$project: {_id: 0,charging_fueling_station_technology: "$_id.charging_fueling_station_technology", projects: 1}},
      handleData)
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
        'Reduction': r.reduction
      }
      return addGeoType(obj, req.query.geotype, r)
    })
    returnData(req, res, data)
  }

  if (CACHE) {
    var conditions = filter.conditions(req.query)
    var id = null
    var project = {_id: 0, reduction: 1}
    if (req.query.geotype) {
      var id = {}
      id[req.query.geotype] =  '$' + req.query.geotype
      project[req.query.geotype] = '$_id.' + req.query.geotype
    }
    mongo.db.collection(req.query.tab).aggregate(
      {$match: conditions},
      {$group: {_id: id, reduction: {$sum: '$co2_emissions_reductions_tons'}}},
      {$project: project}, handleData)
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
          'Savings': r.savings
        }
        return addGeoType(obj, req.query.geotype, r)
      })
      returnData(req, res, data)
    }

  if (CACHE) {
    var conditions = filter.conditions(req.query)
    var id = null
    var project = {_id: 0, savings: 1}
    if (req.query.geotype) {
      var id = {}
      id[req.query.geotype] =  '$' + req.query.geotype
      project[req.query.geotype] = '$_id.' + req.query.geotype
    }
    mongo.db.collection(req.query.tab).aggregate(
      {$match: conditions},
      {$group: {
        _id: id,
        savings: {$sum: '$electricity_savings_kwh'}
      }},
      {$project: project},
      handleData)
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
        'Capacity': r.sum_capacity
      }
    })
    returnData(req, res, data)
  }

  if (CACHE) {
    var getPerYear = function(year, callback) {
      var conditions = filter.conditions(req.query)
      conditions.date = {$gt: new Date(year + '-01-01T12:00:00'), $lt: new Date(year+1 + '-01-01T12:00:00')}
      mongo.db.collection(req.query.tab).aggregate(
        {$match: conditions},
        {$project: {capacity: 1}},
        {$group: {_id: null, sum_capacity:{$sum: '$capacity'}}},
        function(err, data) {
          if (data.length) data[0].year = year.toString()
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
        'Reduction': r.reduction,
      }
    })
    returnData(req, res, data)
  }

  if (CACHE) {
    var getPerYear = function(year, callback) {
      var conditions = filter.conditions(req.query)
      conditions.date = {$gt: new Date(year + '-01-01T12:00:00'), $lt: new Date(year+1 + '-01-01T12:00:00')}
      mongo.db.collection(req.query.tab).aggregate(
        {$match: conditions},
        {$project: {co2_emissions_reductions_tons: 1}},
        {$group: {_id: null, reduction:{$sum: '$co2_emissions_reductions_tons'}}},
        function(err, data) {
          if (data.length) data[0].year = year.toString()
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

module.exports = api