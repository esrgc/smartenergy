var MongoClient = require('mongodb').MongoClient
  , config = require('../config/config')

module.exports.db = {}

module.exports.init = function (next) {
  MongoClient.connect(config.mongo, function(err, db) {
    module.exports.db = db
    next(err)
  })
}