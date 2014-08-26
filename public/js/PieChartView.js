var BarChartView = require('./BarChartView')

var PieChartView = BarChartView.extend({
  drawChart: function() {
    this.chart = new GeoDash.PieChart(this.chartel, {
      label: this.model.get('key')
      , value: 'value'
      , colors: this.colors
      , opacity: 1
      , arclabels: true
      , arclabelsMin: 8
      , opacity: 0.9
      , hoverTemplate: this.model.get('hoverTemplate')
    })
  }
})

module.exports = PieChartView