var BarChartView = require('./BarChartView')


var LineChartView = BarChartView.extend({
  drawChart: function() {
    if (this.model.get('colors')) {
      this.colors = this.model.get('colors')
    }
    this.chart = new GeoDash.LineChart(this.chartel, {
      x: this.model.get('key')
      , y: []
      , colors: this.colors
      , legend: true
      , legendWidth: 90
      , hoverTemplate: '{{y}} ' + this.model.get('units')
      , interpolate: 'monotone'
      , xTickFormat: d3.time.format('%Y')
      , yTicksCount: 5
      , legend: false
    })
    console.log(this.chart.options)
  },
  prepData: function(res) {
    var self = this
    var keys = _.without(_.keys(res[0]), this.model.get('key'))
    if (this.model.get('y')) {
      this.chart.options.y = this.model.get('y')
    } else {
      this.chart.options.y = keys
    }
    var parseDate = d3.time.format('%Y').parse
    _.each(res, function(obj, idx){
      var isDate = _.isDate(obj[self.model.get('key')])
      if(!isDate) {
        obj[self.model.get('key')] = parseDate(obj[self.model.get('key')])
      }
    })
    console.log(res)
    return res
  }
})

module.exports = LineChartView