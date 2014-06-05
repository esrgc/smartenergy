var express = require('express')
  , returnData = require('../lib/return-data')

var api = new express.Router()

/* Return dummy data */

api.get('/getBarData', function(req, res){
  var data = [
    {
      "Name": "Grant 5307",
      "On": 828,
      "Off": 1079,
      "Rest": 300
    },
    {
      "Name": "Grant 5311",
      "On": 689,
      "Off": 795,
      "Rest": 200
    },
    {
      "Name": "Grant DHR",
      "On": 1206,
      "Off": 1805,
      "Rest": 600
    }
  ]
  returnData(req, res, data)
})

api.get('/getBarData2', function(req, res){
  var data = [
    {
      'id': 'Mon',
      '2011': 42235.7,
      '2012': 42235.7,
      '2013': 42235.7
    },
    {
      'id': 'Tue',
      '2011': 165113.8,
      '2012': 42235.7,
      '2013': 42235.7
    },
    {
      'id': 'Wed',
      '2011': 64447.3,
      '2012': 42235.7,
      '2013': 42235.7
    },
    {
      'id': 'Thu',
      '2011': 12444.0,
      '2012': 42235.7,
      '2013': 42235.7
    },
    {
      'id': 'Fri',
      '2011': 22444.0,
      '2012': 42235.7,
      '2013': 42235.7
    },
    {
      'id': 'Sat',
      '2011': 62444.0,
      '2012': 42235.7,
      '2013': 42235.7
    },
    {
      'id': 'Sun',
      '2011': 92444.0,
      '2012': 42235.7,
      '2013': 42235.7
    }
  ]
  returnData(req, res, data)
})

api.get('/getTableData', function(req, res){
  var data = [
    {
      "ID": "111a",
      "CHILD": 13,
      "DIS": 11,
      "On": 358,
      "Off": 463
    },
    {
      "ID": "111r",
      "CHILD": 10,
      "DIS": 32,
      "On": 269,
      "Off": 373
    },
    {
      "ID": "190a",
      "CHILD": 0,
      "DIS": 13,
      "On": 41,
      "Off": 51
    }
  ]
  returnData(req, res, data)
})

api.get('/getLineData', function(req, res){
  var data = [
    {
      'date': '2013-06-01',
      'numCats':22817,
      'goalCats': 80000,
      'numFluffyCats': 10000
    },
    {
      'date': '2013-06-02',
      'numCats':24817,
      'goalCats': 80000,
      'numFluffyCats': 11000
    },
    {
      'date': '2013-06-03',
      'numCats':35817,
      'goalCats': 80000,
      'numFluffyCats': 16000
    },
    {
      'date': '2013-06-04',
      'numCats':48817,
      'goalCats': 80000,
      'numFluffyCats': 18000
    },
    {
      'date': '2013-06-05',
      'numCats':68705,
      'goalCats': 80000,
      'numFluffyCats': 22000
    },
    {
      'date': '2013-06-06',
      'numCats':92920,
      'goalCats': 80000,
      'numFluffyCats': 28000
    }
  ]
  returnData(req, res, data)
})

api.get('/getPieData', function(req, res){
  var data = [
    {
      'id':'lol',
      'value':33
    },
    {
      'id':'cats',
      'value':28
    },
    {
      'id':'cool',
      'value':11
    }
  ]
  returnData(req, res, data)
})

module.exports = api