var BarChartView = require('./BarChartView')

var PieChartView = BarChartView.extend({
  drawChart: function() {
    this.chart = new GeoDash.PieChart(this.chartel, {
      label: this.model.get('key')
      , value: this.model.get('y')
      , colors: this.colors
      , opacity: 1
      , arclabels: true
      , arclabelsMin: 8
      , opacity: 0.9
      , hoverTemplate: '{{label}}: {{value}} ' + this.model.get('units')
      , arcstrokewidth: 0
      , arcstrokecolor: '#999'
      , innerRadius: 50
      , legend: this.model.get('legend')
    })
  }
})

module.exports = PieChartView