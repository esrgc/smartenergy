var Backbone = require('backbone')
Backbone.$ = $

var FilterModel = require('./FilterModel')

var FilterCollection = Backbone.Collection.extend({
  model: FilterModel
})

module.exports = FilterCollection