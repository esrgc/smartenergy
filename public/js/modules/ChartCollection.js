const ChartModel = require('./ChartModel')

const ChartCollection = Backbone.Collection.extend({
  model: ChartModel
})

module.exports = ChartCollection