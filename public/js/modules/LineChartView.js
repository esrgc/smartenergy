var BarChartView = require('./BarChartView')


var LineChartView = BarChartView.extend({
  drawChart: function() {
    if (this.model.get('colors')) {
      this.colors = this.model.get('colors')
    }
    this.chart = new GeoDash.LineChart(this.chartel, {
      x: this.model.get('key')
      , y: this.model.get('y')
      , colors: this.colors
      , legend: true
      , legendWidth: 90
      , hoverTemplate: '{{y}} ' + this.model.get('units')
      , interpolate: 'monotone'
      , xTickFormat: d3.time.format('%Y')
      , yTicksCount: 5
      , legend: false
      , showArea: true
      , accumulate: true
      , valueFormat: this.model.get('valueFormat')
      , yLabel: this.model.get('yLabel')
      , xTimeInterval: {
          timePeriod: d3.time.year,
          interval: 1
        }
    })
  },
  prepData: function(res) {
    var self = this
    var keys = _.without(_.keys(res[0]), this.model.get('key'))
    if (this.model.get('y')) {
      this.chart.options.y = this.model.get('y')
    } else {
      this.chart.options.y = keys
    }
    var parseDate = d3.time.format('%-m-%Y').parse
    _.each(res, function(obj, idx){
      //var isDate = _.isDate(obj[self.model.get('key')])
      obj[self.model.get('key')] = parseDate(obj[self.model.get('key')])
      _.each(keys, function(key) {
        var x = obj[key]
        obj[key] = Math.round(x*100) / 100
      })
    })
    res = _.sortBy(res, function(row, i) {
      return row[self.model.get('key')]
    })
    console.log(res)
    //this.setColors(data)
    return res
  }
})

module.exports = LineChartView