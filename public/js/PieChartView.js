var BarChartView = require('./BarChartView')

var PieChartView = BarChartView.extend({
  drawChart: function() {
    var chartel = this.$el.find('.chart-inner').get(0)
    this.chart = new GeoDash.PieChart(chartel, {
      label: this.model.get('key')
      , value: 'value'
      , colors: Dashboard.colors
      , opacity: 1
    })
  },
  prepData: function(res) {
   return res
  }
})

module.exports = PieChartView