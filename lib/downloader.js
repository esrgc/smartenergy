var mongo = require('./mongo')
  , Socrata = require('./Socrata')
  , config = require('../config/config')

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
      console.log(data.length)
      mongo.db.collection(name).remove({}, function(){
        mongo.db.collection(name).insert(data, function(err, doc) {
          next()
        })
        console.log(data.length)
      })
    })
  }
}

module.exports = new Downloader()