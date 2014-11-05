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
      , colors: this.model.get('colors')
      , yTickFormat: d3.format(".2s")
      , yLabel: this.model.get('yLabel')
      , hoverTemplate: "{{x}}: {{y}} " + this.model.get('units')
      , opacity: 0.9
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
      data = _.sortBy(data, function(row, i) {
        return row[self.chart.options.y[0]]
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