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

    this.chart = false
    return this
  },
  drawChart: function() {
    var chartel = this.$el.find('.chart-inner').get(0)
    this.chart = new GeoDash.BarChartVertical(chartel, {
      x: this.model.get('key')
      , y: []
      , colors: Dashboard.colors
      , yTickFormat: d3.format(".2s")
      , hoverTemplate: "{{x}}: {{y}} projects"
      , opacity: 0.8
    })
  },
  prepData: function(data){
    var self = this
    var row = data[0]
    var keys = _.without(_.keys(row), this.model.get('key'), 'chart_total')
    this.chart.options.y = keys
    data.forEach(function(row) {
      row.chart_total = 0
      self.chart.options.y.forEach(function(y) {
        row[y] = +row[y]
        row.chart_total += row[y]
      })
    })
    data = _.sortBy(data, function(row) {
      return row.chart_total
    }).reverse()
    return data
  },
  toTable: function(){
    var TableView = require('./TableView')
    var view = new TableView({
      model: this.model
    })
    this.$el.parent().html(view.render().el)
    view.update()
//    this.remove()
  }
})

module.exports = BarChartView