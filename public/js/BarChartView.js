var ChartView = require('./ChartView')

var BarChartView = ChartView.extend({
  render: function() {
    var self = this
    this.$el.html(Mustache.render(this.template, this.model.toJSON(), {
      title: $('#title-partial').html(),
      toolbar: $('#toolbar-partial').html()
    }))
    this.updateChartTools()
    this.$el.find('.chart-inner').css('overflow', 'hidden')
    this.chartel = this.$el.find('.chart-inner > .the-chart').get(0)
    this.chart = false
    return this
  },
  drawChart: function() {
    this.chart = new GeoDash.BarChartVertical(this.chartel, {
      x: this.model.get('key')
      , y: this.model.get('y')
      , colors: this.colors
      , yTickFormat: d3.format(".2s")
      , hoverTemplate: "{{x}}: {{y}} " + this.model.get('units')
      , opacity: 0.8
      , barLabels: this.model.get('barLabels')
      , barLabelFormat: this.model.get('barLabelFormat')
      , legend: this.model.get('legend')
      , legendWidth: 'auto'
      , legendPosition: 'inside'
      , valueFormat: this.model.get('valueFormat')
    })
  },
  prepData: function(data){
    var self = this
    var row = data[0]
    if (row) {
      var totals = []
      data.forEach(function(row, i) {
        if (!row[self.model.get('key')]) {
          data.splice(i, 1)
        }
        totals[i] = 0
        if (typeof self.chart.options.y === 'string') {
          var y = +row[self.chart.options.y]
          row[self.chart.options.y] = y
          totals[i] += y
        } else if (typeof self.chart.options.y === 'object') {
          self.chart.options.y.forEach(function(y) {
            row[y] = +row[y]
            totals[i] += row[y]
          })
        }
      })
      data = _.sortBy(data, function(row, i) {
        return totals[i]
      }).reverse()
      this.setColors(data)
      this.model.set('data', data, {silent: true})
      if (data.length > self.dataLimit) {
        data = data.splice(0, self.dataLimit)
      }
    }
    return data
  }
})

module.exports = BarChartView