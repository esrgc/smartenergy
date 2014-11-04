var downloader = require('../lib/downloader')
  , config = require('../config/config')
  , mongo = require('../lib/mongo')
  , _ = require('lodash')
  , async = require('async')

var Admin = function() {
  this.columns = {
    'efficiency': [
      'mea_award', 'other_agency_dollars', 'leveraged_utility_funds','total_project_cost',
      'co2_emissions_reductions_tons','capacity','electricity_savings_kwh','fuel_oil_savings_gallons',
      'propane_savings_gallons','gasoline_savings_gallons','natural_gas_savings_therms'
    ],
    'renewable': [
      'mea_award', 'total_project_cost','other_agency_dollars','co2_emissions_reductions_tons','capacity', 'date'
    ],
    'transportation': [
      'mea_award', 'total_project_cost','other_agency_dollars','leveraged_utility_funds',
      'gallons_of_gasoline_equivalent_avoided','co2_emissions_reductions_tons'
    ]
  }
}

Admin.prototype = {
  update: function(pass, tab, next) {
    if (pass === config.adminpass) {
      var self = this
      if (tab) {
        var tabs = [tab]
      } else {
        var tabs = Object.keys(self.columns)
      }
      async.eachSeries(tabs, 
        function(tab, next){
          console.log('dload ' + tab)
          downloader.downloadTable(tab, function(err, res) {
            console.log('done downloading ' + tab)
            self.format(tab)
            next(err)
          })
        },
      function(err){
        console.log('done updating')
        next(err)
      })
    } else {
      next(true)
    }
  },
  format: function(tab) {
    var self = this
    mongo.db.collection(tab).find().toArray(function(err, docs) {
      docs.forEach(function(doc, idx) {
        self.columns[tab].forEach(function(col) {
          if (col === 'date') {
            if (doc.date) doc.date = new Date(doc.date)
          } else {
            doc[col] = doc[col] ? parseFloat(doc[col].replace(/,/g, "").replace('$', '')) : 0
            if (isNaN(doc[col])) doc[col] = 0
          }
        })
        mongo.db.collection(tab).save(doc, function(err, result) {})
      })
      console.log('saved ' + tab)
    })
  }
}

module.exports = new Admin()