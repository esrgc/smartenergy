var Backbone = require('backbone')
  , _ = require('underscore')
  , BarChartView = require('./BarChartView')
Backbone.$ = $

var PieChartView = BarChartView.extend({
  drawChart: function() {
    var chartel = this.$el.find('.chart-inner').get(0)
    this.chart = new GeoDash.PieChart(chartel, {
      label: this.model.get('key')
      , value: 'value'
      , colors: Dashboard.colors
      , opacity: 1
      , arclabels: true
    })
  },
  prepData: function(res) {
   return res
  }
})

module.exports = PieChartView