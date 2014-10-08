var BarChartView = require('./BarChartView')

var PieChartView = BarChartView.extend({
  changeKey: function() {
    if (this.chart) {
      this.chart.options.label = this.model.get('key')
    }
  },
  drawChart: function() {
    this.chart = new GeoDash.PieChart(this.chartel, {
      label: this.model.get('key')
      , value: this.model.get('y')
      , y: this.model.get('y')
      , colors: this.colors
      , opacity: 1
      , arclabels: true
      , arclabelsMin: 8
      , opacity: 0.9
      , hoverTemplate: '{{label}}: {{value}} ' + this.model.get('units')
      , valueFormat: this.model.get('valueFormat')
      , arcstrokewidth: 0
      , arcstrokecolor: '#999'
      , innerRadius: 50
      , legend: this.model.get('legend')
    })
  }
})

module.exports = PieChartView