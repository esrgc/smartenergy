
/**
 *   Smart Energy Investment Dashboard
 *   Author: Frank Rowe, ESRGC
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

var app = express()

app.set('port', process.env.PORT || 3000)
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(cors())
app.use(bodyParser())
app.use(express.static(path.join(__dirname, 'public')))

// // Initialize DB connections
// app.init = (next) => {
  mongo.init((err) => {
    if (err) {
      throw err;
    }
    //next()
    var env = process.env.NODE_ENV || 'development';
    if ('development' == env) {
      app.use(errorhandler())
    }

    app.use('/',    require('./routers/index'))
    app.use('/api', require('./routers/api'))

  })
// }

app.listen(config.server.port, () => console.log('Listening on port ' + config.server.port));
// app.use('/update', function(req, res) { 
//   admin.update(req.query.p, req.query.tab, function(err) {
//     if (err) res.send('error updating')
//     else res.send('update successful')
//   })
// })

// module.exports = app