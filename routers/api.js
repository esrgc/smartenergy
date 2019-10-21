const { Router } = require('express');
const returnData = require('../lib/return-data');
const filter = require('../lib/filter');
const Socrata = require('../lib/Socrata');
const async = require('async');
const _ = require('lodash');
const config = require('../config/config');
const mongo = require('../lib/mongo');
const ObjectID = require('mongodb').ObjectID;

const api = Router();

var socrataDataset = new Socrata.Dataset()
socrataDataset.setHost('https://data.maryland.gov')
socrataDataset.setAppToken(config.socrata.apptoken)
socrataDataset.setUID(config.socrata.uid)
socrataDataset.setCredentials(config.socrata.user, config.socrata.password)

var CACHE = true

var projcount = {
  $cond: [{ $ne: ['$regional', false] }, 0, 1]
}

const addGeoType = (obj, geotype, row) => {
  if (geotype === 'state' || !geotype || typeof geotype === 'undefined') {
    obj['state'] = 'Maryland'
  } else {
    obj[geotype] = row[geotype]
  }
  return obj
}

api.use((req, res, next) => {
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

    req.on('close', () => {
      if (req.socrata_req) req.socrata_req.abort()
    });
  }
});

api.get('/getTechnology', (req, res) => {
  const handleData = (err, data) => {
    data.toArray((err, docs) => {
      docs = _.map(docs, r => ({
        'Technology': r.technology,
        'Projects': r.projects,
        'Contribution': r.contribution
      }));
      returnData(req, res, docs);
    });
  }

  if (CACHE) {
    var conditions = filter.conditions(req.query, 'technology')
    if (req.query.geotype && req.query[req.query.geotype]) {
      conditions['$or'] = [
        { recipient_region_if_applicable: '' },
        { regional: req.query.geotype }
      ]
    } else {
      conditions.regional = { $eq: false }
    }

    mongo.db.collection(req.query.tab).aggregate(
      { $match: conditions },
      { $project: { technology: 1, mea_award: 1, projcount: projcount } },
      { $group: { _id: { technology: '$technology' }, projects:{ $sum: '$projcount' }, contribution: { $sum: '$mea_award' } } },
      { $project: { _id: 0,technology: "$_id.technology", projects: 1, contribution: 1 } },
      { $sort: { projects: -1 } }, handleData);
  } else {
    var qry = '$select=technology,count(id) as projects&$group=technology'
    qry += filter.where(req.query, qry, 'technology')
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
});

api.get('/getProgramType', (req, res) => {
  var qry = '$select=program_type,count(id) as value&$group=program_type'
  qry += filter.where(req.query, qry)
  req.socrata_req = socrataDataset.query(qry, (err, data) => {
    returnData(req, res, data)
  });
});

api.get('/getProgramName', (req, res) => {
  const handleData = (err, data) => {
    data.toArray((err, docs) => {
      docs = _.map(docs, r => ({
        'Program Name': r.program_name,
        'Projects': r.projects,
        'Contribution': r.contribution
      }));
      returnData(req, res, docs);
    });
  }

  if (CACHE) {
    var conditions = filter.conditions(req.query)
    if (req.query.geotype && req.query[req.query.geotype]) {
      conditions['$or'] = [
        { recipient_region_if_applicable: '' },
        { regional: req.query.geotype }
      ]
    } else {
      conditions.regional = { $eq: false }
    }

    mongo.db.collection(req.query.tab).aggregate(
      { $match: conditions },
      { $project: { program_name: 1, mea_award: 1, projcount: projcount } },
      { $group: { _id: { program_name: '$program_name' }, projects:{ $sum: '$projcount' }, contribution: { $sum: '$mea_award' } } },
      { $project: { _id: 0,program_name: "$_id.program_name", projects: 1, contribution: 1 } },
      { $sort: { projects: -1 } }, handleData);
  } else {
    var qry = '$select=program_name,count(id) as projects&$group=program_name'
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
});

api.get('/getCapacityByArea', (req, res) => {
  const handleData = (err, data) => {
    var d = []
    data = _.map(data, r => {
      var obj =  {
        'Capacity': r.sum_capacity
      }
      return addGeoType(obj, req.query.geotype, r)
    });
    returnData(req, res, data);
  }

  if (CACHE) {
    var conditions = filter.conditions(req.query)
    var id = null
    var project = { _id: 0, sum_capacity: 1 }
    if (req.query.geotype) {
      var id = {}
      id[req.query.geotype] =  '$' + req.query.geotype
      project[req.query.geotype] = '$_id.' + req.query.geotype
      if (req.query.geotype && req.query[req.query.geotype]) {
        conditions['$or'] = [
          { recipient_region_if_applicable: '' },
          { regional: req.query.geotype }
        ]
      } else {
        conditions.regional = {$eq: false}
        conditions[req.query.geotype] = {$exists: true, $ne: ''}
      }
    }

    mongo.db.collection(req.query.tab).aggregate(
      { $match: conditions },
      { $group: { _id: id, sum_capacity: { $sum: '$capacity' } } },
      { $project: project }, handleData);
  } else {
    var qry = '$select=sum(capacity)'
    qry += filter.geotype(req.query)
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
});

api.get('/getCapacityBySector', (req, res) => {
  const handleData = (err, data) => {
    data = _.map(data, r => {
      return {
        'Sector': r.sector,
        'Capacity': r.sum_capacity
      }
    });
    returnData(req, res, data);
  }

  if (CACHE) {
    var conditions = filter.conditions(req.query)
    var aggregate = function (obj, prev) { prev.sum_capacity += +obj.capacity || 0 }

    mongo.db.collection(req.query.tab).aggregate(
      { $match: conditions },
      { $project: { capacity: 1, sector: 1 } },
      { $group: { _id: { sector: '$sector' }, sum_capacity: { $sum: '$capacity' } } },
      { $project: { _id: 0, sector: "$_id.sector", sum_capacity: 1 } }, handleData);
  } else {
    var qry = '$select=sector,sum(capacity)&$group=sector'
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
});

api.get('/getSector', (req, res) => {
  const handleData = (err, data) => {
    data.toArray((err, docs) => {
      docs = _.map(docs, r => ({
        'Sector': r.sector,
        'Projects': r.projects,
        'Contribution': r.contribution
      }));
      returnData(req, res, docs);
    });
  }

  if (CACHE) {
    var conditions = filter.conditions(req.query, 'sector')
    if (req.query.geotype && req.query[req.query.geotype]) {
      conditions['$or'] = [
        { recipient_region_if_applicable: '' },
        { regional: req.query.geotype }
      ]
    } else {
      conditions.regional = {$eq: false}
    }
    
    mongo.db.collection(req.query.tab).aggregate(
      { $match: conditions },
      { $project: { sector: 1, mea_award: 1, projcount: projcount } },
      { $group: { _id: { sector: '$sector' }, projects:{ $sum: '$projcount' }, contribution: { $sum: '$mea_award' } } },
      { $project: { _id: 0, sector: "$_id.sector", projects: 1, contribution: 1 } },
      { $sort: { projects: -1 } }, handleData);
  } else {
    var qry = '$select=sector,count(id)%20as%20projects&$group=sector'
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
});

api.get('/getStats', (req, res) => {
  const handleData = (err, data) => {
    data.toArray((err, docs) => {
      returnData(req, res, docs)
    });
  }

  if (CACHE) {
    var conditions = filter.conditions(req.query)
    if (req.query.geotype && req.query[req.query.geotype]) {
      conditions['$or'] = [
        { recipient_region_if_applicable: '' },
        { regional: req.query.geotype }
      ]
    } else {
      conditions.regional = { $eq: false }
    }

    mongo.db.collection(req.query.tab).aggregate(
      { $match: conditions },
      { $project: { mea_award: 1, electricity_savings_kwh: 1, total_project_cost: 1,
        //only count rows with total cost and mea award towards
        //Investment Levarage calculation
        il_total_project_cost: {
          $cond: [
            { 
              $and:
                [
                  { $ne: ['$total_project_cost', ''] },
                  { $ne: ['$total_project_cost', 0] },
                  { $ne: ['$mea_award', ''] }
                ]
            },
            '$total_project_cost', //true
            0 //false
          ]
        },
        il_contribution: {
          $cond: [
            { 
              $and:
                [
                  { $ne: ['$total_project_cost', ''] },
                  { $ne: ['$total_project_cost', 0] },
                  { $ne: ['$mea_award', ''] }
                ]
            },
            '$mea_award', //true
            0 //false
          ]
        }
      } },
      { $group: {
        _id: null,
        total_projects:{ $sum: 1 },
        project_cost: { $sum: '$total_project_cost' },
        il_project_cost: { $sum: '$il_total_project_cost' },
        contribution: { $sum: '$mea_award' },
        il_contribution: { $sum: '$il_contribution' },
        electricity_savings_kwh: { $sum: '$electricity_savings_kwh' }
      } },
      { $project: { _id: 0, total_projects: 1, project_cost: 1, contribution: 1, il_project_cost: 1, il_contribution: 1, electricity_savings_kwh: 1 } }, handleData);
  } else {
    var qry = '$select=sum(mea_award)%20as%20contribution,sum(total_project_cost)%20as%20project_cost,sum(other_agency_dollars),count(id)%20as%20total_projects'
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, (err, data) => {
      returnData(req, res, data)
    });
  }
})

api.get('/getContribution', (req, res) => {
  const handleData = (err, data) => {
    data.toArray((err, docs) => {
      docs = _.map(docs, r => {
        var obj = {
          'MEA Contribution': r.mea_contribution,
          'Total Project Cost': r.project_cost
        }
        if (r.project_cost > 0) {
          obj['Leveraged Investment'] = r.project_cost - r.mea_contribution
        } else {
          obj['Leverage Investment'] = 0
        }
        return addGeoType(obj, req.query.geotype, r)
      });
      returnData(req, res, docs)
    });
  }
  
  if (CACHE) {
    var conditions = filter.conditions(req.query)
    var id = null
    var project_in = { 
      mea_award: 1,
      total_project_cost: {
        $cond: [
          { $ne: ['$total_project_cost', ''] },
          '$total_project_cost',
          { $add: ['$mea_award'] }
        ]
      }
    }

    var project_out = { _id: 0, projects: 1, mea_contribution: 1, project_cost: 1 }
    if (req.query.geotype) {
      var id = {}
      id[req.query.geotype] =  '$' + req.query.geotype
      project_in[req.query.geotype] = 1
      project_out[req.query.geotype] = '$_id.' + req.query.geotype
      if (req.query.geotype && req.query[req.query.geotype]) {
        conditions['$or'] = [
          { recipient_region_if_applicable: '' },
          { regional: req.query.geotype }
        ]
      } else {
        conditions.regional = { $eq: false }
        conditions[req.query.geotype] = { $exists: true, $ne: '' }
      }
    }

    mongo.db.collection(req.query.tab).aggregate(
      { $match: conditions },
      { $project: project_in },
      { $group: {
        _id: id,
        projects:{ $sum: 1 },
        mea_contribution: { $sum: { $add: ['$mea_award'] } },
        project_cost: { $sum: '$total_project_cost' }
      } },
      { $project: project_out },
      { $sort: { projects: -1 } }, handleData);
  } else {
    var qry = '$select=sum(mea_award)%20as%20mea_contribution,sum(other_agency_dollars) as sum_other_agency_dollars, sum(total_project_cost)%20as%20project_cost'
    qry += filter.geotype(req.query)
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
});

api.get('/getPoints', (req, res) => {
  var data = [], 
    limit = 10000, 
    offset = 0, 
    qry = '';

  if (CACHE) {
    var technology_fields = []
    if (req.query.tab === 'renewable') {
      technology_fields.push('technology')
    } else if (req.query.tab === 'efficiency') {
      technology_fields.push('sector')
    } else if (req.query.tab === 'transportation') {
      var techs = ['charging_fueling_station_technology', 'vehicle_technology']
      techs.forEach(function(tech) {
        if (req.query[tech]) {
          technology_fields.push(tech)
        }
      })
      if (technology_fields.length === 0) {
        technology_fields = techs
      }
    }

    var conditions = filter.conditions(req.query, 'point')
    conditions.regional = {$eq: false}
    var project = {point: 1, _id: 1}
    technology_fields.forEach(field => {
      project[field] = 1
    });

    var cursor = mongo.db.collection(req.query.tab).find(conditions, project)
    cursor.toArray((err, data) => {
      var points = _.groupBy(data, 'point')
      var response = { points: [] }
      for (var p in points) {
        var obj = {
          point: p,
          projects: points[p].length
        }
        technology_fields.forEach(technology_field => {
          var techs = _.filter(_.uniq(_.map(points[p], technology_field)), null)
          var techcount = []
          techs.forEach(tech => {
            var where = {}
            where[technology_field] = tech
            var x = { t: tech }
            x.p = _.filter(points[p], where).length
            techcount.push(x)
          });
          obj[technology_field] = techcount
        });
        response.points.push(obj)
      }
      returnData(req, res, response)
    });
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
            projects: _.map(points[p], 'technology')
          })
        }
        returnData(req, res, response)
      }
    )
  }
});

api.get('/getProject', (req, res) => {
  var qry = ''
  if (CACHE) {
    var conditions = filter.conditions(req.query)
    conditions._id = new ObjectID(conditions._id)
    mongo.db.collection(req.query.tab).find(conditions).toArray((err, data) => {
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
    req.socrata_req = socrataDataset.query(qry, (err, data) => {
      returnData(req, res, data)
    });
  }
});

api.get('/getProjectsByPoint', (req, res) => {
  var qry = ''
  if (CACHE) {
    var tech_field = req.query.tech_field
    var tech = req.query.tech
    delete req.query.tech
    delete req.query.tech_field
    var conditions = filter.conditions(req.query)
    conditions[tech_field] = tech
    conditions.regional = false
    mongo.db.collection(req.query.tab).find(conditions).toArray((err, data) => {
      returnData(req, res, data)
    });
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
    req.socrata_req = socrataDataset.query(qry, (err, data) => {
      returnData(req, res, data)
    });
  }
});

api.get('/getStationTechnology', (req, res) => {
  const handleData = (err, data) => {
    data.toArray((err, docs) => {
      docs = _.map(docs, r => ({
        'Technology': r.charging_fueling_station_technology,
        'Stations': r.projects,
        'Contribution': r.contribution
      }));
      returnData(req, res, docs)
    });
  }
  
  if (CACHE) {
    var conditions = filter.conditions(req.query, 'charging_fueling_station_technology')
    if (req.query.geotype && req.query[req.query.geotype]) {
      conditions['$or'] = [
        {recipient_region_if_applicable: ''},
        {regional: req.query.geotype}
      ]
    } else {
      conditions.regional = {$eq: false}
    }

    mongo.db.collection(req.query.tab).aggregate(
      { $match: conditions },
      { $project: { charging_fueling_station_technology: 1, projcount: projcount, mea_award: 1 } },
      { $group: { _id: { charging_fueling_station_technology: '$charging_fueling_station_technology'}, projects: { $sum: '$projcount' }, contribution: { $sum: '$mea_award' } } },
      { $project: { _id: 0,charging_fueling_station_technology: "$_id.charging_fueling_station_technology", projects: 1, contribution: 1 } }, handleData);
  } else {
    var qry = '$select=charging_fueling_station_technology,count(id) as projects&$group=charging_fueling_station_technology'
    qry += filter.where(req.query, qry, 'charging_fueling_station_technology')
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
});

api.get('/getVehicleTechnology', (req, res) => {
  const handleData = (err, data) => {
    data.toArray((err, docs) => {
      docs = _.map(docs, r => ({
        'Technology': r.vehicle_technology,
        'Projects': r.projects,
        'Contribution': r.contribution
      }));
      returnData(req, res, docs)
    });
  }
  
  if (CACHE) {
    var conditions = filter.conditions(req.query, 'vehicle_technology')
    if (req.query.geotype && req.query[req.query.geotype]) {
      conditions['$or'] = [
        { recipient_region_if_applicable: '' },
        { regional: req.query.geotype }
      ]
    } else {
      conditions.regional = { $eq: false }
    }
    mongo.db.collection(req.query.tab).aggregate(
      { $match: conditions },
      { $project: { vehicle_technology: 1, projcount: projcount, mea_award: 1 } },
      { $group: { _id: { vehicle_technology: '$vehicle_technology' }, projects: { $sum: '$projcount' }, contribution: { $sum: '$mea_award' } } },
      { $project: { _id: 0,vehicle_technology: "$_id.vehicle_technology", projects: 1, contribution: 1 } }, handleData);
  } else {
    var qry = '$select=vehicle_technology,count(id) as value&$group=vehicle_technology'
    qry += filter.where(req.query, qry, 'vehicle_technology')
    req.socrata_req = socrataDataset.query(qry, (err, data) => {
      returnData(req, res, data)
    });
  }
});

api.get('/getReductions', (req, res) => {
  const handleData = (err, data) => {
    data.toArray((err, docs) => {
      docs = _.map(docs, r => {
        var obj = {
          'Reduction': r.reduction
        }
        return addGeoType(obj, req.query.geotype, r)
      });
      returnData(req, res, docs)
    });
  }

  if (CACHE) {
    var conditions = filter.conditions(req.query)
    if (req.query.geotype && req.query[req.query.geotype]) {
      conditions['$or'] = [
        { recipient_region_if_applicable: '' },
        { regional: req.query.geotype }
      ]
    } else {
      conditions.regional = { $eq: false }
    }

    var id = null
    var project = { _id: 0, reduction: 1 };
    if (req.query.geotype) {
      var id = {}
      id[req.query.geotype] =  '$' + req.query.geotype
      project[req.query.geotype] = '$_id.' + req.query.geotype
      if (!req.query[req.query.geotype]) {
        conditions[req.query.geotype] = { $exists: true, $ne: '' }
      }
    }
    mongo.db.collection(req.query.tab).aggregate(
      { $match: conditions },
      { $group: { _id: id, reduction: { $sum: '$co2_emissions_reductions_tons' } } },
      { $project: project }, handleData);
  } else {
    var qry = '$select=sum(co2_emissions_reductions_tons) as reduction'
    qry += filter.geotype(req.query)
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
});

api.get('/getSavings', (req, res) => {
  const handleData = (err, data) => {
    data.toArray((err, docs) => {
      docs = _.map(docs, r => {
        var obj = {
          'Savings': r.savings
        }
        return addGeoType(obj, req.query.geotype, r)
      });
      returnData(req, res, docs)
    });
  }

  if (CACHE) {
    var conditions = filter.conditions(req.query)
    if (req.query.geotype && req.query[req.query.geotype]) {
      conditions['$or'] = [
        { recipient_region_if_applicable: '' },
        { regional: req.query.geotype }
      ];
    } else {
      conditions.regional = { $eq: false }
    }

    var id = null
    var project = { _id: 0, savings: 1 }
    if (req.query.geotype) {
      var id = {}
      id[req.query.geotype] =  '$' + req.query.geotype
      project[req.query.geotype] = '$_id.' + req.query.geotype      
      if (!req.query[req.query.geotype]) {
        conditions[req.query.geotype] = { $exists: true, $ne: '' }
      }
    }

    mongo.db.collection(req.query.tab).aggregate(
      { $match: conditions },
      { $group: { _id: id, savings: { $sum: '$electricity_savings_kwh' } } },
      { $project: project }, handleData);
  } else {
    var qry = '$select=sum(electricity_savings_kwh) as savings'
    qry += filter.geotype(req.query)
    qry += filter.where(req.query, qry)
    req.socrata_req = socrataDataset.query(qry, handleData)
  }
});

api.get('/getCapacityOverTime', (req, res) => {
  const handleData = (err, results) => {
    var data = _.flatten(results)
    data = _.map(data, r => {
      return {
        'Date': r.date,
        'Capacity': r.sum_capacity
      }
    });
    returnData(req, res, data)
  }

  if (CACHE) {
    var conditions = filter.conditions(req.query)
    if (req.query.geotype && req.query[req.query.geotype]) {
      conditions['$or'] = [
        { recipient_region_if_applicable: '' },
        { regional: req.query.geotype }
      ];
    } else {
      conditions.regional = { $eq: false }
    }

    conditions.date = { $gt: new Date('2008-01-01T12:00:00'), $lt: new Date('2015-01-01T12:00:00') };
    mongo.db.collection(req.query.tab).aggregate(
      { $match: conditions },
      { $project: {
        yrmonth: {
          $concat: [
            { '$substr': [ { '$month': '$date' }, 0, 2 ] },
            '-',
            { '$substr': [ { '$year': '$date' }, 0, 4 ] }
          ]
        },
        month: { $month: '$date' },
        year: { $year: '$date' },
        capacity: 1
      } },
      { $group: { _id: { yrmonth: '$yrmonth' }, sum_capacity:{ $sum: '$capacity' } } },
      { $project: { date: '$_id.yrmonth', sum_capacity: 1 } }, handleData);
    // var getPerYear = function(year, callback) {
    //   var conditions = filter.conditions(req.query)
    //   conditions.date = {$gt: new Date(year + '-01-01T12:00:00'), $lt: new Date(year+1 + '-01-01T12:00:00')}
    //   mongo.db.collection(req.query.tab).aggregate(
    //     {$match: conditions},
    //     {$project: {capacity: 1}},
    //     {$group: {_id: null, sum_capacity:{$sum: '$capacity'}}},
    //     function(err, data) {
    //       if (data.length) data[0].year = year.toString()
    //       callback(err, data)
    //   })
    // }
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

  // async.parallel([
  //   function(callback) { getPerYear(2008, callback) },
  //   function(callback) { getPerYear(2009, callback) },
  //   function(callback) { getPerYear(2010, callback) },
  //   function(callback) { getPerYear(2011, callback) },
  //   function(callback) { getPerYear(2012, callback) },
  //   function(callback) { getPerYear(2013, callback) },
  //   function(callback) { getPerYear(2014, callback) }
  // ], handleData)
})

api.get('/getReductionOverTime', (req, res) => {
  const handleData = (err, results) => {
    var data = _.flatten(results)
    data = _.map(data, r => {
      return {
        'Date': r.date,
        'Reduction': r.reduction,
      }
    });
    returnData(req, res, data)
  }

  if (CACHE) {
    var conditions = filter.conditions(req.query)
    if (req.query.geotype && req.query[req.query.geotype]) {
      conditions['$or'] = [
        { recipient_region_if_applicable: '' },
        { regional: req.query.geotype }
      ]
    } else {
      conditions.regional = { $eq: false }
    }

    conditions.date = { $gt: new Date('2008-01-01T12:00:00'), $lt: new Date('2015-01-01T12:00:00') };
    mongo.db.collection(req.query.tab).aggregate(
      { $match: conditions },
      { $project: {
        yrmonth: {
          $concat: [
            { '$substr': [ { '$month': '$date' }, 0, 2 ] },
            '-',
            { '$substr': [ { '$year': '$date' }, 0, 4 ] }
          ]
        },
        month: { $month: '$date' },
        year: { $year: '$date' },
        co2_emissions_reductions_tons: 1
      } },
      { $group: { _id: { yrmonth: '$yrmonth' }, reduction:{ $sum: '$co2_emissions_reductions_tons' } } },
      { $project: { date: '$_id.yrmonth', reduction: 1 } }, handleData);
    // var getPerYear = function(year, callback) {
    //   var conditions = filter.conditions(req.query)
    //   conditions.date = {$gt: new Date(year + '-01-01T12:00:00'), $lt: new Date(year+1 + '-01-01T12:00:00')}
    //   mongo.db.collection(req.query.tab).aggregate(
    //     {$match: conditions},
    //     {$project: {co2_emissions_reductions_tons: 1}},
    //     {$group: {_id: null, reduction:{$sum: '$co2_emissions_reductions_tons'}}},
    //     function(err, data) {
    //       if (data.length) data[0].year = year.toString()
    //       callback(err, data)
    //   })
    // }
  } else {
    var _getPerYear = (year, callback) => {
      var nextyear = year + 1;
      var qry = '$select=sum(co2_emissions_reductions_tons) as reduction, \'' + year + '\' as year&$where=date>%27' + year + '-01-01T12:00:00%27  and date<%27' + nextyear + '-01-01T12:00:00%27 '
      qry += filter.where(req.query, qry)
      socrataDataset.query(qry, (err, data) => {
        callback(null, data)
      });
    }

    var getPerYear = async.memoize(_getPerYear)
  }
  // async.parallel([
  //   function(callback) { getPerYear(2008, callback) },
  //   function(callback) { getPerYear(2009, callback) },
  //   function(callback) { getPerYear(2010, callback) },
  //   function(callback) { getPerYear(2011, callback) },
  //   function(callback) { getPerYear(2012, callback) },
  //   function(callback) { getPerYear(2013, callback) },
  //   function(callback) { getPerYear(2014, callback) }
  // ], handleData)
});

module.exports = api