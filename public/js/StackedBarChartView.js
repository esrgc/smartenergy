var BarChartView = require('./BarChartView')

var StackedBarChartView = BarChartView.extend({
  prepData: function(data){
    var self = this
    var row = data[0]
    if (row) {
      if (this.model.get('y').length < 1) {
        var keys = _.without(_.keys(row), this.model.get('key'))
        if (keys.length === 1) {
          this.chart.options.y = keys[0]
        } else {
          this.chart.options.y = keys
        }
      } else {
        this.chart.options.y = this.model.get('y')
      }
      var totals = []
      data.forEach(function(row, i) {
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
        var i = (parseFloat(row['Total Project Cost']) - parseFloat(row['MEA Contribution']))/parseFloat(row['MEA Contribution']) || 0
        row['Investment Leverage'] = d3.round(i, 2)
        return row
      })
    }
    return data
  },
  toTable: function(){
    var y = ['Total Project Cost', 'MEA Contribution', 'Investment Leverage']
    var TableView = require('./TableView')
    var view = new TableView({
      model: this.model,
      y: y
    })
    this.$el.parent().html(view.render().el)
    view.resize()
  }
})

module.exports = StackedBarChartView