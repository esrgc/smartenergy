var Backbone = require('backbone')
Backbone.$ = $

var MapView = require('./MapView')
  , ChartModel = require('./ChartModel')
  , BarChartView = require('./BarChartView')
  , HorizontalBarChartView = require('./HorizontalBarChartView')
  , TableView = require('./TableView')
  , LineChartView = require('./LineChartView')
  , PieChartView = require('./PieChartView')
  , StatView = require('./StatView')
  , FilterCollection = require('./FilterCollection')
  , FilterMenuView = require('./FilterMenuView')
  , ChartCollection = require('./ChartCollection')

var Dashboard = Backbone.View.extend({
  colors: ['#94BA65', '#2790B0', '#2B4E72'],
  initialize: function(){
    this.filterCollection = new FilterCollection()
    this.filterCollection.on('change', this.update, this)
    //this.filterCollection.on('add', this.update, this)
    this.filterCollection.on('remove', this.update, this)

    this.chartCollection = new ChartCollection()
    this.chartCollection.add([
      {title: "Number of Projects", api: 'api/getPieData', key: 'id', chart_type: 'pie'},
      {title: "Capacity", api: 'api/getPieData', key: 'id', chart_type: 'pie'},
      //{title: "Bar Chart", api: 'api/getBarData2', key: 'id', chart_type: 'bar'},
      {title: "MEA Contribution", api: 'api/getContribution', key: 'contribution', chart_type: 'stat', format: d3.format('$,')},
      {title: "Investment Leverage", api: 'api/getLeverage', key: 'leverage', chart_type: 'stat'},
    ])

    this.makeFilters()
  },
  makeFilters: function() {
    this.filterCollection.add([
      {value: 'Solar PV', color: '#FFAA00'},
      {value: 'Solar Hot Water', color: '#26AD6A'},
      {value: 'Wind', color: '#C238C0'},
      {value: 'Vehicle Fueling & Charging', color: '#FF0000'},
      {value: 'Geothermal', color: '#AB953F'},
      {value: 'Energy Effiency', color: '#0070FF'},
      {value: 'Landfall Gas', color: '#00FF00'},
      {value: 'Clean Fuel Vehicles', color: '#75ae92'},
      {value: 'Wood Burning Stoves', color: '#ebeb00'}
    ])
  },
  render: function(){
    var mapView = new MapView()
    $('.block0').html(mapView.render().el)
    mapView.makeMap()

    var filterMenuView = new FilterMenuView()
    $('.block1').html(filterMenuView.render().el)

    var offset = 2
    this.chartCollection.each(function(chart, idx) {
      var view = {}
      switch (chart.get('chart_type')) {
        case 'bar':
          view = new BarChartView({
            model: chart
          })
          console.log(view)
          break
        case 'line':
          view = new LineChartView({
            model: chart
          })
          break
        case 'pie':
          view = new PieChartView({
            model: chart
          })
          break
        case 'hbar':
          view = new HorizontalBarChartView({
            model: chart
          })
          break
        case 'table':
          view = new TableView({
            model: chart
          })
          break
        case 'stat':
          view = new StatView({
            model: chart
          })
          break
      }
      $('.block' + (idx+offset)).html(view.render().el)
    })

    this.update()

    return this
  },
  update: function(){
    console.log(this)
    this.chartCollection.each(function(chart){
      chart.update()
    })
  }
})

module.exports = Dashboard