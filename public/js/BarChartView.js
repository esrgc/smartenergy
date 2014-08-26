var ChartView = require('./ChartView')

var BarChartView = ChartView.extend({
  events: function(){
    return _.extend({}, ChartView.prototype.events,{
      "click .totable": "toTable"
    })
  },
  render: function() {
    var self = this
    this.$el.html(Mustache.render(this.template, this.model.toJSON(), {
      title: $('#title-partial').html(),
      toolbar: $('#toolbar-partial').html()
    }))
    this.$el.find('.chart-inner').css('overflow', 'hidden')
    this.chartel = this.$el.find('.chart-inner > .the-chart').get(0)
    this.chart = false
    return this
  },
  drawChart: function() {
    this.chart = new GeoDash.BarChartVertical(this.chartel, {
      x: this.model.get('key')
      , y: []
      , colors: this.colors
      , yTickFormat: d3.format(".2s")
      , hoverTemplate: "{{x}}: {{y}} projects"
      , opacity: 0.8
    })
  },
  prepData: function(data){
    var self = this
    var row = data[0]
    if (row) {
      var keys = _.without(_.keys(row), this.model.get('key'))
      this.chart.options.y = keys
      var totals = []
      data.forEach(function(row, i) {
        if (!row[self.model.get('key')]) {
          row[self.model.get('key')] = 'Other'
        }
        totals[i] = 0
        self.chart.options.y.forEach(function(y) {
          row[y] = +row[y]
          totals[i] += row[y]
        })
      })
      data = _.sortBy(data, function(row, i) {
        return totals[i]
      }).reverse()
      this.setColors(data)
    }
    return data
  },
  setColors: function(data) {
    var self = this
    var colors = []
    _.each(data, function(d) {
      var x = d[self.model.get('key')]
      var filters = Dashboard.filterCollection.where({value: x})
      if (filters.length) {
        if (filters[0].get('color')) {
          colors.push(filters[0].get('color'))
        }
      }
    })
    if (colors.length) {
      self.colors = colors
    }
  },
  toTable: function(){
    var TableView = require('./TableView')
    var view = new TableView({
      model: this.model
    })
    this.$el.parent().html(view.render().el)
    view.resize()
  }
})

module.exports = BarChartView