
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
  colors: ['#2B4E72','#94BA65', '#2790B0'],
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
    this.chartCollection.on('add', this.renderChart, this)
    this.makeCharts()
  },
  makeCharts: function() {
    this.chart_hash = {
      '#energyeffiency': [
        {title: "Electricity Savings", api: 'api/getPieData', key: 'geo', chart_type: 'pie'},
        {title: "CO2 Emissions Reductions", api: 'api/getPieData2', key: 'geo', chart_type: 'pie'},
        {title: "Program Type", api: 'api/getProgramType', key: 'program_type', chart_type: 'pie'},
        {title: "Sector", api: 'api/getSector', key: 'sector', chart_type: 'pie'},
        {title: "MEA Contribution", api: 'api/getContribution', key: 'contribution', chart_type: 'stat', format: d3.format('$,')}
      ],
      '#renewableenergy': [
        {title: "Technology Type", api: 'api/getTechnology', key: 'technology', chart_type: 'bar'},
        {title: "Program Type", api: 'api/getProgramType', key: 'program_type', chart_type: 'pie'},
        {title: "Capacity", api: 'api/getCapacity', key: 'county', chart_type: 'pie'},
        {title: "Sector", api: 'api/getSector', key: 'sector', chart_type: 'pie'},
        {title: "MEA Contribution", api: 'api/getContribution', key: 'contribution', chart_type: 'stat', format: d3.format('$,')}
      ],
      '#transportation': [
        {title: "Charging/Fueling Station Technology", api: 'api/getPieData', key: 'geo', chart_type: 'pie'},
        {title: "Vehicle Technology", api: 'api/getPieData2', key: 'geo', chart_type: 'pie'},
        {title: "Program Type", api: 'api/getProgramType', key: 'program_type', chart_type: 'pie'},
        {title: "Sector", api: 'api/getSector', key: 'sector', chart_type: 'pie'},
        {title: "MEA Contribution", api: 'api/getContribution', key: 'contribution', chart_type: 'stat', format: d3.format('$,')},
      ]
    }
  },
  makeFilters: function() {
    this.effiency = []
    this.renewables = [
      {value: 'Solar PV', color: '#FF851B', type: 'technology'},
      {value: 'Solar Hot Water', color: '#39CCCC', type: 'technology'},
      {value: 'Geothermal', color: '#FF4136', type: 'technology'},
      {value: 'Wood Burning Stoves', color: '#FFDC00', type: 'technology'},
      {value: 'Wind', color: '#B10DC9', type: 'technology'},
      {value: 'Landfill Gas', color: '#01FF70', type: 'technology'},
      {value: 'Bioheat', color: '#0074D9', type: 'technology'}
    ]
    this.transportation = [
      {value: 'Electric', color: '#0074D9', type: 'vehicle-technology'},
      {value: 'Biodiesel', color: '#39CCCC', type: 'vehicle-technology'},
      {value: 'E85', color: '#2ECC40', type: 'vehicle-technology'},
      {value: 'Natural Gas (CNG)', color: '#FFDC00', type: 'vehicle-technology'},
      {value: 'Natural Gas (LNG)', color: '#FF851B', type: 'vehicle-technology'},
      {value: 'Propane', color: '#FF4136', type: 'vehicle-technology'},
      {value: 'Hydrogen', color: '#F012BE', type: 'vehicle-technology'},
      {value: 'Hybrid', color: '#B10DC9', type: 'vehicle-technology'},
      {value: 'Idle Reduction', color: '#01FF70', type: 'vehicle-technology'},
    ]
    this.programtypes = [
      {value: 'Grant', type: 'program_type'},
      {value: 'Rebate/Voucher', type: 'program_type'},
      {value: 'Financing', type: 'program_type'},
      {value: 'Tax Credit', type: 'program_type'},
      {value: 'Other', type: 'program_type'}
    ]
    this.sectors = [
      {value: 'Residential', type: 'sector'},
      {value: 'Commercial', type: 'sector'},
      {value: 'Agriculture', type: 'sector'},
      {value: 'Local Government', type: 'sector'},
      {value: 'State Government', type: 'sector'}
    ]
    this.filter_hash = {
      '#energyeffiency': this.sectors.concat(this.programtypes),
      '#renewableenergy': this.sectors.concat(this.renewables).concat(this.programtypes),
      '#transportation': this.sectors.concat(this.transportation).concat(this.programtypes)
    }
  },
  renderChart: function(chart) {
    var view = {}
    switch (chart.get('chart_type')) {
      case 'bar':
        view = new BarChartView({
          model: chart
        })
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
    var container = $('<div class="chart-container"/>')
    container.append(view.render().el)
    this.$el.find('.charts > .row').append(container)
    chart.update()
  },
  render: function() {
    this.$el.html(Mustache.render(this.template))
    var mapView = new MapView()

    this.$el.find('.charts .row').append(mapView.render().el)
    mapView.makeMap()

    var filterMenuView = new FilterMenuView()
    this.$el.find('.charts .row').append(filterMenuView.render().el)

    this.filterCollection.reset(this.filter_hash['#renewableenergy'])
    this.chartCollection.add(this.chart_hash['#renewableenergy'])

    return this
  },
  update: function() {
    this.chartCollection.each(function(chart) {
      chart.update()
    })
  },
  switchTab: function(e) {
    var self = this
    var geos = this.filterCollection.filter(function(model){
      return model.get('type') === 'geo'
    })
    this.filterCollection.reset(this.filter_hash[e.target.hash].concat(geos))
    this.chartCollection.reset()
    this.chartCollection.add(this.chart_hash[e.target.hash])
  }
})

module.exports = Dashboard