var express = require('express')
  , returnData = require('../lib/return-data')
  , filter = require('../lib/filter')
  , Socrata = require('../lib/Socrata')
  , config = require('../config/config')

var socrataDataset = new Socrata.Dataset()
socrataDataset.setHost('https://data.maryland.gov')
socrataDataset.setAppToken(config.socrata.apptoken)
socrataDataset.setUID(config.socrata.uid)
socrataDataset.setCredentials(config.socrata.user, config.socrata.password)

var api = new express.Router()

/* Return dummy data */

api.get('/getTechnology', function(req, res){
  var qry = '$select=technology,count(id) as value&$group=technology'
  qry += filter(req.query)
  socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getProgramType', function(req, res){
  var qry = '$select=program_type,count(id) as value&$group=program_type'
  qry += filter(req.query)
  socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getCapacity', function(req, res){
  var qry = '$select=county,sum(capacity)%20as%20value&$group=county'
  qry += filter(req.query)
  socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getSector', function(req, res){
  var qry = '$select=sector,count(id)%20as%20value&$group=sector'
  qry += filter(req.query)
  socrataDataset.query(qry, function(data) {
    returnData(req, res, data)
  })
})

api.get('/getContribution', function(req, res){
  var qry = '$select=sum(mea_award)%20as%20contribution'
  qry += filter(req.query)
  socrataDataset.query(qry, function(data) {
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

module.exports = api