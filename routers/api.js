var express = require('express')
  , returnData = require('../lib/return-data')
  , filter = require('../lib/filter')

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
      'technology': 'Solar PV',
      'value': 2600
    },{
      'technology': 'Solar Thermal',
      'value': 1200
    },{
      'technology': 'Geothermal',
      'value': 900
    },{
      'technology': 'Wood Burning Stoves',
      'value': 200
    },{
      'technology': 'Wind',
      'value': 200
    },{
      'technology': 'Biomass',
      'value': 100
    },{
      'technology': 'Landfall Gas',
      'value': 250
    },{
      'technology': 'Bioheat',
      'value': 650
    },
  ]
  var data = filter(req.query, data)
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
  var data = filter(req.query, data)
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
  var data = filter(req.query, data)
  returnData(req, res, data)
})

api.get('/getPieData3', function(req, res){
  var data = [
    {program: 'Grant', value: 400},
    {program: 'Rebate/Voucher', value: 300},
    {program: 'Financing', value: 150},
    {program: 'Tax Credit', value: 750},
    {program: 'Other', value: 50}
  ]
  var data = filter(req.query, data)
  returnData(req, res, data)
})

api.get('/getSector', function(req, res){
  var data = [
    {sector: 'Residential', value: 400},
    {sector: 'Commercial', value: 300},
    {sector: 'Agricultural', value: 150},
    {sector: 'Local Government', value: 750},
    {sector: 'State Government', value: 50}
  ]
  var data = filter(req.query, data)
  returnData(req, res, data)
})

api.get('/getContribution', function(req, res){
  var data = {
    'contribution': 363928
  }
  returnData(req, res, data)
})

api.get('/getLeverage', function(req, res){
  var data = {
    'leverage': 11.6
  }
  returnData(req, res, data)
})

module.exports = api