var Backbone = require('backbone')
Backbone.$ = $

var ChartToolbar = Backbone.View.extend({
  template: $('#chart-template').html(),
  events: {
    "click .download":  "download",
    "click .code":  "code"
  },
  initialize: function(options) {
    var self = this
    this.options = options || {};
    this.render()
  },
  render: function() {
    this.$el.html(Mustache.render(this.template, this.model.toJSON(), {
      title: $('#title-partial').html()
    }))
    return this
  },
  update: function() {

  },
  prepData: function(res) {
    return res
  },
  download: function(e) {
    var querystring = $.param(Dashboard.filterCollection.toJSON())
    var url = this.model.get('api') + '?csv=true&' + querystring
    window.open(url)
  },
  code: function(e) {
    var querystring = $.param(Dashboard.filterCollection.toJSON())
    var url = this.model.get('api') + '?' + querystring
    window.open(url)
  }
})

module.exports = ChartView