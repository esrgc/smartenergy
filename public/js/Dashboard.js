var Backbone = require('backbone')
Backbone.$ = $

var MapView = require('./MapView')
  , ChartModel = require('./ChartModel')
  , BarChartView = require('./BarChartView')
  , HorizontalBarChartView = require('./HorizontalBarChartView')
  , TableView = require('./TableView')
  , LineChartView = require('./LineChartView')
  , PieChartView = require('./PieChartView')
  , FilterCollection = require('./FilterCollection')
  , ChartCollection = require('./ChartCollection')

var Dashboard = Backbone.View.extend({
  colors: ['#94BA65', '#2790B0', '#2B4E72'],
  initialize: function(){
    this.filterCollection = new FilterCollection()
    this.filterCollection.on('change', this.update, this)
    this.filterCollection.on('add', this.update, this)
    this.filterCollection.on('remove', this.update, this)

    this.chartCollection = new ChartCollection()
    this.chartCollection.add([
      {title: "Bar Chart", api: 'api/getBarData2', key: 'id', chart_type: 'bar'},
      {title: "Table", api: 'api/getTableData', key: 'ID', chart_type: 'table'},
      {title: "Line Chart", api: 'api/getLineData', key: 'date', chart_type: 'line'},
      {title: "Bar Chart 2", api: 'api/getBarData', key: 'Name', chart_type: 'hbar'},
      {title: "Pie Chart", api: 'api/getPieData', key: 'id', chart_type: 'pie'}
    ])
  },
  render: function(){
    var mapView = new MapView()
    $('.block0').html(mapView.render().el)
    mapView.makeMap()

    var view = new BarChartView({
      model: this.chartCollection.at(0)
    })
    $('.block1').html(view.render().el)

    var view = new TableView({
      model: this.chartCollection.at(1)
    })
    $('.block2').html(view.render().el)

    var view = new LineChartView({
      model: this.chartCollection.at(2)
    })
    $('.block3').html(view.render().el)

    var view = new HorizontalBarChartView({
      model: this.chartCollection.at(3)
    })
    $('.block4').html(view.render().el)

    var view = new PieChartView({
      model: this.chartCollection.at(4)
    })
    $('.block5').html(view.render().el)

    this.update()

    return this
  },
  update: function(){
    var self = this
    this.chartCollection.each(function(chart){
      chart.update()
    })
  }
})

module.exports = Dashboard