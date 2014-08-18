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
      , opacity: 1
    })
  },
  prepData: function(data){
    var row = data[0]
    var keys = _.without(_.keys(row), this.model.get('key'))
    var numberkeys = []
    _.each(keys, function(key){
      if(_.isNumber(row[key])){
        numberkeys.push(key)
      }
    })
    this.chart.options.y = numberkeys
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