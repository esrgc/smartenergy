const MongoClient = require('mongodb').MongoClient;
const config = require('../config/config');

module.exports.init = (next) => {
  MongoClient.connect(config.mongo, (err, client) => {
    if (err) {
      next(err);
    }
    console.log('> Connected to database.');
    module.exports.db = client.db('smartenergy');
    next();
  });
}