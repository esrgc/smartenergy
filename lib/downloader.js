const mongo = require('./mongo');
const Socrata = require('./Socrata');
const async = require('async');
const config = require('../config/config');

function Downloader() {
  var socrataDataset = new Socrata.Dataset()
  socrataDataset.setHost('https://data.maryland.gov')
  socrataDataset.setAppToken(config.socrata.apptoken)
  socrataDataset.setUID(config.socrata.uid)
  socrataDataset.setCredentials(config.socrata.user, config.socrata.password)

  this.downloadTable = function(name, next) {
    var uid = config.socrata.uids[name]
    socrataDataset.setUID(uid)
    socrataDataset.download(function(err, data) {
      async.each(data, function(doc, next) {
        mongo.db.collection(name).update(
          {id: doc.id},
          doc,
          {upsert: true},
          function(err, count, status) {
            next(err)
          }
        )
      }, function(err) {
        next(err)
      })
      // mongo.db.collection(name).remove({}, function(){
      //   mongo.db.collection(name).insert(data, function(err, doc) {
      //     next()
      //   })
      // })
    })
  }
}

module.exports = new Downloader()