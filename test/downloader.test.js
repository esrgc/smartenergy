var downloader = require('../lib/downloader')
  , config = require('../config/config')
  , mongo = require('../lib/mongo')


mongo.init(function() {
  //downloader.downloadTable('renewableenergy', function(err, res) {
    //console.log(err, res)
    // mongo.db.collection('renewableenergy').find({sector: 'Commercial'}).toArray(function(err, docs) {
    //   console.log(err, docs)
    // })
  //})
  downloader.downloadTable('energyeffiency', function(err, res) {
    console.log(err)
  })
  // downloader.downloadTable('transportation', function(err, res) {
  //   console.log(err)
  // })

})