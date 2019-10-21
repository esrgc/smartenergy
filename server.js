
/**
 *   Smart Energy Investment Dashboard
 *   Author: Frank Rowe, ESRGC
 */

const express = require('express');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const mongo = require('./lib/mongo');

const app = express();

app.set('port', process.env.PORT || 3000)
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(cors())
app.use(bodyParser())
app.use(express.static(path.join(__dirname, 'public')))

// // Initialize DB connections
mongo.init(err => {
  if (err) throw err;
  var env = process.env.NODE_ENV || 'development';
  if ('development' == env) {
    app.use(errorhandler())
  }

  app.use('/', require('./routers/index'));
  app.use('/api', require('./routers/api'));
});

// app.use('/update', function(req, res) { 
//   admin.update(req.query.p, req.query.tab, function(err) {
//     if (err) res.send('error updating')
//     else res.send('update successful')
//   })
// })

app.listen(config.server.port, () => console.log('Listening on port ' + config.server.port));