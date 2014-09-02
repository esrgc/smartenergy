
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
  activetab: 'renewableenergy',
  events: {
    //'click .tabs a': 'switchTab'
  },
  initialize: function() {
    this.filterCollection = new FilterCollection()
    this.makeFilters()
    this.filterCollection.on('change:active', this.update, this)
    this.filterCollection.on('add', this.update, this)
    this.filterCollection.on('remove', this.update, this)

    this.chartCollection = new ChartCollection()
    this.chartCollection.on('add', this.renderChart, this)
    this.makeCharts()
  },
  makeCharts: function() {
    this.mapModel = {title: "Map", api: 'api/getPoints', key: 'geo', chart_type: 'map', visible: false}
    this.chart_hash = {
      'energyeffiency': [
        {title: "Electricity Savings", api: 'api/getSavings', key: 'county', chart_type: 'pie', units: 'kWh'},
        {title: "CO2 Emissions Reductions", api: 'api/getReductions', key: 'county', chart_type: 'pie', units: 'tons'},
        {title: "Program Type", api: 'api/getProgramType', key: 'program_type', chart_type: 'pie', units: 'projects'},
        {title: "Sector", api: 'api/getSector', key: 'sector', chart_type: 'pie', units: 'projects'}
      ],
      'renewableenergy': [
      {title: "Investment Stats", api: 'api/getStats', key: 'contribution', chart_type: 'stat', format: d3.format('$,'), toolbar: false},
        {title: "Technology Type", api: 'api/getTechnology', key: 'technology', chart_type: 'pie', units: 'projects'},
        {title: "Program Type", api: 'api/getProgramType', key: 'program_type', chart_type: 'pie', units: 'projects'},
        {title: "Sector", api: 'api/getSector', key: 'sector', chart_type: 'pie', units: 'projects'},
        {title: "MEA Contribution By County", api: 'api/getContribution', key: 'county', chart_type: 'pie', group: 'geo', units: 'dollars'}
      ],
      'transportation': [
        {title: "Vehicle Technology", api: 'api/getVehicleTechnology', key: 'vehicle_technology', chart_type: 'pie'},
        {title: "Charging/Fueling Station Technology", api: 'api/getStationTechnology', key: 'charging_fueling_station_technology', chart_type: 'pie'},
        {title: "Program Type", api: 'api/getProgramType', key: 'program_type', chart_type: 'pie', units: 'projects'},
        {title: "Sector", api: 'api/getSector', key: 'sector', chart_type: 'pie', units: 'projects'}
      ]
    }
  },
  makeFilters: function() {
    this.effiency = []
    this.renewables = [
      {value: 'Solar PV', color: '#FF851B', type: 'technology', units: 'kW'},
      {value: 'Solar Hot Water', color: '#39CCCC', type: 'technology', units: 'sqft'},
      {value: 'Geothermal', color: '#FF4136', type: 'technology', units: 'tons'},
      {value: 'Wood Burning Stove', color: '#FFDC00', type: 'technology', units: 'BTUs/hr'},
      {value: 'Wind', color: '#B10DC9', type: 'technology', units: 'kW'},
      {value: 'Landfill Gas', color: '#01FF70', type: 'technology', units: 'kW'},
      {value: 'Bioheat', color: '#0074D9', type: 'technology', units: 'gallons'}
    ]
    this.transportation = [
      {value: 'Electric', color: '#0074D9', type: 'vehicle_technology'},
      {value: 'Biodiesel', color: '#39CCCC', type: 'vehicle_technology'},
      {value: 'E85', color: '#2ECC40', type: 'vehicle_technology'},
      {value: 'Natural Gas (CNG)', color: '#FFDC00', type: 'vehicle_technology'},
      {value: 'Natural Gas (LNG)', color: '#FF851B', type: 'vehicle_technology'},
      {value: 'Propane', color: '#FF4136', type: 'vehicle_technology'},
      {value: 'Hydrogen', color: '#F012BE', type: 'vehicle_technology'},
      {value: 'Hybrid', color: '#B10DC9', type: 'vehicle_technology'},
      {value: 'Electric Hybrid', color: '#999', type: 'vehicle_technology'},
      {value: 'Idle Reduction', color: '#01FF70', type: 'vehicle_technology'},
    ]
    this.stations = [
      {value: 'Electric', color: '#0074D9', type: 'charging_fueling_station_technology'},
      {value: 'Biodiesel', color: '#39CCCC', type: 'charging_fueling_station_technology'},
      {value: 'E85', color: '#2ECC40', type: 'charging_fueling_station_technology'},
      {value: 'Natural Gas (CNG)', color: '#FFDC00', type: 'charging_fueling_station_technology'},
      {value: 'Propane', color: '#FF4136', type: 'charging_fueling_station_technology'}
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
      'energyeffiency': this.sectors.concat(this.programtypes),
      'renewableenergy': this.sectors.concat(this.renewables),
      'transportation': this.sectors.concat(this.transportation)
    }
    this.filterCollection.add(this.filter_hash[this.activetab])
    var groupfilter = {
      value: '',
      type: 'group',
      active: true
    }
    this.filterCollection.add(groupfilter)
  },
  renderChart: function(chart) {
    var view = {}
    if (chart.get('chart_type') === 'map') {
      var mapView = new MapView({
        model: chart
      })

      this.$el.find('.charts > .row').append(mapView.render().el)
      mapView.makeMap()
      chart.update()
    } else {
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
      setTimeout(function(){view.resize()}, 100)
      chart.update()
    }
  },
  render: function() {
    this.$el.html(Mustache.render(this.template))

    this.chartCollection.add(this.mapModel)

    this.filterMenuView = new FilterMenuView()
    this.$el.find('.charts > .row').append(this.filterMenuView.render().el)

    this.filterMenuView.update()

    this.chartCollection.add(this.chart_hash[this.activetab])

    return this
  },
  update: function(e) {
    var self = this
    var x = {title: "Capacity/Annual Savings", api: 'api/getCapacityByCounty', key: 'county', chart_type: 'pie'}
    var capacity_charts = [
      {title: "Capacity/Annual Savings By County", api: 'api/getCapacityByCounty', key: 'county', chart_type: 'pie'},
      {title: "Capacity/Annual Savings By Sector", api: 'api/getCapacityBySector', key: 'sector', chart_type: 'pie'}
    ]
    capacity_charts.forEach(function(chart) {
      var tech_filters = self.filterCollection.where({active: true, type: 'technology'})
      if (tech_filters.length === 1) {
        var chart_exits = self.chartCollection.where({title: chart.title})
        if (chart_exits.length === 0) {
          chart.units = tech_filters[0].get('units')
          self.chartCollection.add(chart)
        }
      } else {
        self.chartCollection.each(function(_chart) {
          if (_chart.get('title') === chart.title) {
            self.chartCollection.remove(_chart)
          }
        })
      }
    })
    this.chartCollection.each(function(chart) {
      chart.update()
    })
  },
  switchTab: function(e) {
    var self = this
    this.activetab = e.target.hash.replace('#', '')
    var filters = []
    var geos = this.filterCollection.where({geo: true})
    this.filterCollection.reset(this.filter_hash[this.activetab].concat(geos))
    this.filterMenuView.update()

    var charts = []
    this.chartCollection.findWhere({chart_type: 'map'}).update()
    this.chartCollection.each(function(chart, idx) {
      if (chart.get('chart_type') !== 'map') {
        charts.push(chart)
      }
    })
    this.chartCollection.remove(charts)
    this.chartCollection.add(this.chart_hash[this.activetab])
  }
})

module.exports = Dashboard