var BarChartView = require('./BarChartView')

var StackedBarChartView = BarChartView.extend({
  prepData: function(data){
    var self = this
    var row = data[0]
    if (row) {
      var totals = []
      data.forEach(function(row, i) {
        console.log(row)
        if (!row[self.model.get('key')]) {
          row[self.model.get('key')] = 'Other'
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
      data = _.map(data, function(row) {
        if (row['MEA Contribution'] === 0) {
          var i = 0
        } else {
          var i = (parseFloat(row['Total Project Cost']) - parseFloat(row['MEA Contribution']))/parseFloat(row['MEA Contribution']) || 0
        }
        row['Investment Leverage'] = d3.round(i, 2)
        return row
      })
      if (data.length > self.dataLimit) {
        data = data.splice(0, self.dataLimit)
      }
    }
    return data
  },
  toTable: function(){
    var y = ['Total Project Cost', 'MEA Contribution', 'Investment Leverage']
    var TableView = require('./TableView')
    var view = new TableView({
      model: this.model,
      y: y,
      chart: this.chart
    })
    this.$el.parent().html(view.render().el)
    view.resize()
  }
})

module.exports = StackedBarChartView