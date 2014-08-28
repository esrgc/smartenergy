var express = require('express')
  , pkg = require('../package.json');

var index = express.Router()

index.get('/', function(req, res){
  res.render('index', {
    title: 'Maryland Smart Energy Investment Map',
    version: pkg.version,
    name: pkg.name,
    env: process.env.NODE_ENV
  })
})

module.exports = index