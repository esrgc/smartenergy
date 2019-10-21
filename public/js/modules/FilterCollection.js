const FilterModel = require('./FilterModel')

const FilterCollection = Backbone.Collection.extend({
  model: FilterModel
})

module.exports = FilterCollection