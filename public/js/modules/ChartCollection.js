var ChartModel = require('./ChartModel')

var ChartCollection = Backbone.Collection.extend({
  model: ChartModel
})

module.exports = ChartCollection