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
      , colors: this.model.get('colors')
      , arclabels: true
      , arclabelsMin: 8
      , opacity: 1
      , hoverTemplate: '{{label}}: {{value}} ' + this.model.get('units')
      , valueFormat: this.model.get('valueFormat')
      , arcstrokewidth: 1
      , arcstrokecolor: '#fff'
      , innerRadius: 0
      , legend: this.model.get('legend')
    })
  },
  changeChartOptionsOnKey: function(key) {

    this.chart.options.valueFormat = d3.format(',.0f')

    var tool = _.findWhere(this.model.get('tools'), {value: key})
    if (tool) {
      if (tool.type) {
        if (tool.type === 'money') {
          this.chart.options.valueFormat = d3.format('$,.0f')
        }
      }
    }

    this.chart.options.value = key
    this.chart.options.y = key
    this.model.set('value', key)
    this.model.set('y', key)
  },
  prepData: function(data){
    var self = this
    var row = data[0]
    if (row) {
      data = _.sortBy(data, function(row, i) {
        return row[self.chart.options.y[0]]
      })
      this.setColors(data)
      this.model.set('data', data, {silent: true})
      if (data.length > self.dataLimit) {
        data = data.splice(0, self.dataLimit)
      }
    }
    return data
  }
})

module.exports = PieChartView