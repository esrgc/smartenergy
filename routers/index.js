var express = require('express')
  , fs = require('fs')
  , path = require('path')
  , pkg = require('../package.json')
  , Busboy = require('busboy')
  , admin = require('../lib/admin')
  , config = require('../config/config')

var index = express.Router()

index.get('/', function(req, res){
  res.render('index', {
    version: pkg.version,
    name: pkg.name,
    env: process.env.NODE_ENV
  })
})

index.get('/update', function(req, res){
  res.render('update', {
    version: pkg.version,
    name: pkg.name,
    env: process.env.NODE_ENV
  })
})

index.post('/update', function(req, res){
  var tab = ''
    , fileLocation = ''
    , pass = false
  var busboy = new Busboy({ headers: req.headers })
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
    if (fieldname === 'tab') {
      tab = val
    }
    if (fieldname === 'password') {
      pass = val === config.adminpass
    }
  })
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    if (mimetype === 'text/csv') {
      var fileLocation = path.join(path.join(__dirname, '../data'), path.basename(filename))
      var w = file.pipe(fs.createWriteStream(fileLocation))
      w.on('finish', function() {
        if (pass) {
          admin.geocode(tab, fileLocation, function(err, res) {
            console.log('done')
          })
        }
      })
    }
    file.on('end', function() {

    })
  })
  busboy.on('finish', function() {
    res.writeHead(200, { 'Connection': 'close' })
    if (pass) {
      res.end("Updating.")
    } else {
      res.end("Incorrect Password.")
    }
  })
  return req.pipe(busboy)
})


module.exports = index