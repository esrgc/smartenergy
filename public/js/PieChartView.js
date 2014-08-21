var BarChartView = require('./BarChartView')

var PieChartView = BarChartView.extend({
  drawChart: function() {
    this.chart = new GeoDash.PieChart(this.chartel, {
      label: this.model.get('key')
      , value: 'value'
      , colors: Dashboard.colors
      , opacity: 1
      , arclabels: true
      , arclabelsMin: 8
      , opacity: 0.8
    })
  }
})

module.exports = PieChartView