var downloader = require('../lib/downloader')
  , config = require('../config/config')
  , mongo = require('../lib/mongo')


mongo.init(function() {
  downloader.downloadTable('renewableenergy', function(err, res) {
    console.log('done downloading')
    format('renewableenergy')
  })
  // downloader.downloadTable('energyeffiency', function(err, res) {
  //   console.log(err)
  //   format('energyeffiency')
  // })
  // downloader.downloadTable('transportation', function(err, res) {
  //   console.log(err)
       //format('transportation')
  // })
})

var columns = {
  'energyeffiency': [
    'mea_award', 'leveraged_utility_funds','total_project_cost',
    'co2_emissions_reductions_tons','capacity','electricity_savings_kwh','fuel_oil_savings_gallons',
    'propane_savings_gallons','gasoline_savings_gallons','natural_gas_savings_therms'
  ],
  'renewableenergy': [
    'mea_award', 'total_project_cost','other_agency_dollars','co2_emissions_reductions_tons','capacity', 'date'
  ],
  'transportation': [
    'mea_award', 'total_project_cost','other_agency_dollars','leveraged_utility_funds',
    'gallons_of_gasoline_equivalent_avoided','co2_emissions_reductions_tons'
  ]
}
function format(tab) {
  mongo.db.collection(tab).find().toArray(function(err, docs) {
    docs.forEach(function(doc, idx) {
      console.log(idx)
      columns[tab].forEach(function(col) {
        if (col === 'date') {
          if (doc.date) doc.date = new Date(doc.date)
        } else {
          doc[col] = doc[col] ? parseInt(doc[col].replace(/,/g, "").replace('$', '')) : 0
          if (isNaN(doc[col])) doc[col] = 0
        }
      })
      mongo.db.collection(tab).save(doc, function(err, result) {})
    })
  })
}