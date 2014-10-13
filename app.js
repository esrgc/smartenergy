
/**
 *   Boardpress
 *   Author: Frank Rowe, ESRGC
 *   Date: April, 2014
 */

var express = require('express')
  , errorhandler = require('errorhandler')
  , bodyParser = require('body-parser')
  , morgan = require('morgan')
  , http = require('http')
  , cors = require('cors')
  , path = require('path')
  , config = require('./config/config')
  , mongo = require('./lib/mongo')
  , admin = require('./routers/admin')
var app = express()

app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(cors())
app.use(bodyParser())
app.use(express.static(path.join(__dirname, 'public')))

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
   app.use(errorhandler())
}

app.use('/',    require('./routers/index'))
app.use('/api', require('./routers/api'))
app.use('/update', function(req, res) { 
  admin.update(req.query.p, function(err) {
    if (err) res.send('error updating')
    else res.send('update succusseful')
  })
})

// Initialize DB connections
app.init = function(next) {
  mongo.init(function(err) {
    if (err) throw err;
    next()
  })
}

module.exports = app