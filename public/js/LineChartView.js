var Backbone = require('backbone')
  , _ = require('underscore')
  , BarChartView = require('./BarChartView')
Backbone.$ = $

var LineChartView = BarChartView.extend({
  drawChart: function() {
    var chartel = this.$el.find('.chart-inner').get(0)
    this.chart = new GeoDash.LineChart(chartel, {
      x: this.model.get('key')
      , y: []
      , colors: Dashboard.colors
      , legend: true
      , legendWidth: 90
      , hoverTemplate: "{{x}}: {{y}}"
      , interpolate: 'none'
      , xTickFormat: d3.time.format('%m/%d')
      , yTicksCount: 5
    })
  },
  prepData: function(res) {
    var self = this
    var keys = _.without(_.keys(res[0]), this.model.get('key'))
    this.chart.options.y = keys
    var parseDate = d3.time.format('%Y-%m-%d').parse
    _.each(res, function(obj, idx){
      var isDate = _.isDate(obj[self.model.get('key')])
      if(!isDate) {
        obj.date = parseDate(obj[self.model.get('key')])
      }
    })
    return res
  }
})

module.exports = LineChartView