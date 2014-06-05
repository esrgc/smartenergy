
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

module.exports = app