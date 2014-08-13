
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
  template: $('#dashboard-template').html(),
  el: $(".dashboard"),
  events: {
    'click .tabs a': 'switchTab'
  },
  initialize: function() {
    this.filterCollection = new FilterCollection()
    this.makeFilters()
    this.filterCollection.on('change', this.update, this)
    this.filterCollection.on('add', this.update, this)
    this.filterCollection.on('remove', this.update, this)

    this.chartCollection = new ChartCollection()
    this.chartCollection.add([
      {title: "Number of Projects", api: 'api/getPieData', key: 'id', chart_type: 'pie'},
      {title: "Capacity", api: 'api/getPieData2', key: 'id', chart_type: 'pie'},
      //{title: "Bar Chart", api: 'api/getBarData2', key: 'id', chart_type: 'bar'},
      {title: "MEA Contribution", api: 'api/getContribution', key: 'contribution', chart_type: 'stat', format: d3.format('$,')},
      {title: "Investment Leverage", api: 'api/getLeverage', key: 'leverage', chart_type: 'stat'},
    ])
  },
  makeFilters: function() {
    this.effiency = []
    this.renewables = [
      {value: 'Solar PV', color: '#FFAA00', type: 'technology'},
      {value: 'Solar Thermal', color: '#26AD6A', type: 'technology'},
      {value: 'Geothermal', color: '#AB953F', type: 'technology'},
      {value: 'Wood Burning Stoves', color: '#ebeb00', type: 'technology'},
      {value: 'Wind', color: '#C238C0', type: 'technology'},
      {value: 'Biomass', color: '#FF0000', type: 'technology'},
      {value: 'Landfall Gas', color: '#00FF00', type: 'technology'},
      {value: 'Bioheat', color: '#0070FF', type: 'technology'}
    ]
    this.transportation = [
      {value: 'Electric', color: '#FFAA00', type: 'vehicle-technology'},
      {value: 'Biodiesel', color: '#FFAA00', type: 'vehicle-technology'},
      {value: 'E85', color: '#FFAA00', type: 'vehicle-technology'},
      {value: 'Natural Gas (CNG)', color: '#FFAA00', type: 'vehicle-technology'},
      {value: 'Natural Gas (LNG)', color: '#FFAA00', type: 'vehicle-technology'},
      {value: 'Propane', color: '#FFAA00', type: 'vehicle-technology'},
      {value: 'Hydrogen', color: '#FFAA00', type: 'vehicle-technology'},
      {value: 'Hybrid', color: '#FFAA00', type: 'vehicle-technology'},
      {value: 'Idle Reduction', color: '#FFAA00', type: 'vehicle-technology'},
    ]
    this.programtypes = [
      {value: 'Grant', type: 'program'},
      {value: 'Rebate/Voucher', type: 'program'},
      {value: 'Financing', type: 'program'},
      {value: 'Tax Credit', type: 'program'},
      {value: 'Other', type: 'program'}
    ]
    this.sectors = [
      {value: 'Residential', type: 'sector'},
      {value: 'Commercial', type: 'sector'},
      {value: 'Agricultural', type: 'sector'},
      {value: 'Local Government', type: 'sector'},
      {value: 'State Government', type: 'sector'}
    ]
    this.filter_hash = {
      '#energyeffiency': this.sectors.concat(this.programtypes),
      '#renewableenergy': this.sectors.concat(this.renewables).concat(this.programtypes),
      '#transportation': this.sectors.concat(this.transportation).concat(this.programtypes)
    }
    this.filterCollection.add(this.filter_hash['#renewableenergy'])
  },
  render: function() {
    this.$el.html(Mustache.render(this.template))

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
  update: function() {
    this.chartCollection.each(function(chart){
      chart.update()
    })
  },
  switchTab: function(e) {
    console.log(e.target.hash)
    this.filterCollection.reset(this.filter_hash[e.target.hash])
  }
})

module.exports = Dashboard