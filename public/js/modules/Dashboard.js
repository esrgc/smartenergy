
var MapView = require('./MapView')
  , ChartModel = require('./ChartModel')
  , BarChartView = require('./BarChartView')
  , StackedBarChartView = require('./StackedBarChartView')
  , HorizontalBarChartView = require('./HorizontalBarChartView')
  , TableView = require('./TableView')
  , LineChartView = require('./LineChartView')
  , PieChartView = require('./PieChartView')
  , StatView = require('./StatView')
  , FilterCollection = require('./FilterCollection')
  , FilterMenuView = require('./FilterMenuView')
  , ChartCollection = require('./ChartCollection')
  , templates = require('./templates')(Handlebars)

var Dashboard = Backbone.View.extend({
  colors: ['#2790B0', '#2B4E72', '#94BA65'],
  template: templates.dashboard,
  el: $(".dashboard"),
  activetab: 'home',
  socrata_links: {
    'renewable': 'https://data.maryland.gov/dataset/Renewable-Energy-Geocoded/mqt3-eu4s',
    'efficiency': 'https://data.maryland.gov/dataset/Energy-Efficiency-Geocoded/3afy-8fbr',
    'transportation': 'https://data.maryland.gov/dataset/Transportation-Geocoded/4dvs-jtxq'
  },
  tab_colors: {
    'renewable': '#12A6B8',
    'efficiency': '#2B4E72',
    'transportation': '#E5972F'
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
    var self = this
    this.mapModel = {title: "Map", api: 'api/getPoints', key: 'geo', chart_type: 'map'}
    this.charts = {
      stats: {
        title: "Investment Stats",
        api: 'api/getStats',
        key: 'contribution',
        chart_type: 'stat',
        format: d3.format('$,'),
        width: 'col-md-6 col-lg-3',
        toolbar: false,
        sort: false
      },
      technology: {
        title: "Technology Type",
        api: 'api/getTechnology',
        y: 'Contribution',
        key: 'Technology',
        chart_type: 'pie',
        filter_color: true,
        units: '',
        valueFormat: d3.format('$,.0f'),
        width: 'col-lg-3 col-md-3 col-sm-12',
        tools: [{value: 'Contribution', text: 'Contribution', type: 'money'}, {value: 'Projects', text: 'Projects'}]
      },
      mea_contribution: {
        title: "Contribution By Region",
        api: 'api/getContribution',
        key: 'County',
        y: ['MEA Contribution'],
        chart_type: 'stacked',
        group: 'geo',
        units: '',
        valueFormat: d3.format('$,.0f'),
        width: 'col-lg-6 col-md-9',
        colors: [self.colors[0]],
        yLabel: 'Dollars',
        xLabelAngle: -60,
        xAxisLabelPadding: 50,
        legend: true,
        dontFormat: ['Investment Leverage'],
        geo: true,
        tools: [{value: 'MEA Contribution,Other Contributions', text: 'All Contributions', type: 'money', yLabel: 'Dollars'}, {value: 'MEA Contribution', text: 'MEA Contribution', type: 'money', yLabel: 'Dollars'}]
      },
      program: {
        title: "Investments By Program",
        api: 'api/getProgramName',
        key: 'Program Name',
        y: ['Contribution'],
        colors: [self.colors[0]],
        chart_type: 'bar',
        units: '',
        barLabels: true,
        yLabel: 'Dollars',
        valueFormat: d3.format('$,.0f'),
        tools: [{value: 'Contribution', text: 'Contribution', type: 'money', yLabel: 'Dollars'}, {value: 'Projects', text: 'Projects', yLabel: 'Projects'}],
        barLabelFormat: d3.format('$.2s')
      },
      sector: {
        title: "Investments By Sector",
        api: 'api/getSector',
        key: 'Sector',
        y: ['Contribution'],
        colors: [self.colors[0]],
        chart_type: 'bar',
        yLabel: 'Dollars',
        units: '',
        barLabels: true,
        valueFormat: d3.format('$,.0f'),
        tools: [{value: 'Contribution', text: 'Contribution', type: 'money', yLabel: 'Dollars'},
        {value: 'Projects', text: 'Projects', yLabel: 'Projects'}],
        barLabelFormat: d3.format('$.2s')
      },
      electricity: {title: "Electricity Savings By Region", api: 'api/getSavings', key: 'County', y: ['Savings'], chart_type: 'bar', units: 'kWh', geo: true, width: 'col-md-6 col-sm-12', colors: [self.colors[0]], yLabel: 'kWh', width: 'col-lg-6 col-md-12', xLabelAngle: -60, xAxisLabelPadding: 50},
      reduction: {title: "CO2 Emissions Reductions By Region", api: 'api/getReductions', key: 'County', y: ['Reduction'], chart_type: 'bar', units: 'tons', geo: true, width: 'col-md-6 col-sm-12', colors: [self.colors[0]], yLabel: 'Tons', width: 'col-lg-6 col-md-12', xLabelAngle: -60, xAxisLabelPadding: 50},
      reductionTime: {title: "CO2 Reduction", api: 'api/getReductionOverTime', key: 'Date', y: 'Reduction', chart_type: 'line', units: 'tons', labelFormat: d3.time.format("%m/%y"), showUnitsInTable: true, yLabel: 'Tons'},
      station_technology: {
        title: "Charging/Fueling Station Technology",
        api: 'api/getStationTechnology',
        key: 'Technology',
        y: 'Contribution',
        chart_type: 'pie',
        units: '',
        valueFormat: d3.format(',.0f'),
        filter_color: true,
        width: 'col-lg-3 col-md-3 col-sm-12',
        tools: [{value: 'Contribution', text: 'Contribution', type: 'money'}, {value: 'Stations', text: 'Stations'}]
      },
      vehicle_technology: {
        title: "Vehicle Technology",
        api: 'api/getVehicleTechnology',
        key: 'Technology',
        y: 'Contribution',
        chart_type: 'pie',
        units: '',
        valueFormat: d3.format('$,.0f'),
        filter_color: true,
        width: 'col-lg-3 col-md-3 col-sm-12',
        tools: [{value: 'Contribution', text: 'Contribution', type: 'money'}, {value: 'Projects', text: 'Projects'}]
      }
    }
    this.charts.sector2 = _.clone(this.charts.sector)
    this.charts.sector2.width = 'col-lg-3 col-md-3 col-sm-12'
    this.charts.program2 = _.clone(this.charts.program)
    this.charts.program2.width = 'col-lg-6 col-md-12'
    this.chart_hash = {
      efficiency: [this.charts.stats, 
      this.charts.sector2, 
      this.charts.mea_contribution, 
      this.charts.program2, this.charts.electricity, 
      this.charts.reduction],
      renewable: [this.charts.stats, this.charts.technology, this.charts.mea_contribution, this.charts.program, this.charts.sector, this.charts.reductionTime
      ],
      transportation: [this.charts.stats, this.charts.station_technology, this.charts.mea_contribution, this.charts.sector, this.charts.vehicle_technology],
      capacity_charts: [
        {title: "Capacity By Area", api: 'api/getCapacityByArea', key: 'County', y: ['Capacity'], chart_type: 'bar', showUnitsInTable: true, geo: true, valueFormat: d3.format(',.2f'), width: 'col-md-6 col-sm-12'},
        {title: "Capacity By Sector", api: 'api/getCapacityBySector', key: 'Sector', y: ['Capacity'], chart_type: 'bar', showUnitsInTable: true},
        {title: "Capacity Growth", api: 'api/getCapacityOverTime', key: 'Date', y: ['Capacity'], chart_type: 'line', labelFormat: d3.time.format("%Y"), showUnitsInTable: true, filter_color: true},
      ]
    }
  },
  makeFilters: function() {
    this.effiency = []
    this.renewables = [
      {value: 'Solar PV', color: '#f39c12', type: 'technology', units: 'kW'},
      {value: 'Solar Hot Water', color: '#16a085', type: 'technology', units: 'sqft'},
      {value: 'Geothermal', color: '#FF4136', type: 'technology', units: 'tons'},
      {value: 'Wood Burning Stove', color: '#FFDC00', type: 'technology', units: 'BTUs/hr'},
      {value: 'Wind', color: '#3498db', type: 'technology', units: 'kW'},
      {value: 'Bioheat', color: '#9b59b6', type: 'technology', units: 'gallons'},
      {value: 'Landfill Gas', color: '#01FF70', type: 'technology', units: 'kW'}
    ]
    this.vehicle_technology = [
      {value: 'Electric', color: '#0074D9', type: 'vehicle_technology'},
      {value: 'Biodiesel', color: '#f39c12', type: 'vehicle_technology'},
      {value: 'E85', color: '#2ECC40', type: 'vehicle_technology'},
      {value: 'Natural Gas (CNG)', color: '#FFDC00', type: 'vehicle_technology'},
      {value: 'Natural Gas (LNG)', color: '#39CCCC', type: 'vehicle_technology'},
      {value: 'Propane', color: '#FF4136', type: 'vehicle_technology'},
      {value: 'Hydrogen', color: '#F012BE', type: 'vehicle_technology'},
      {value: 'Hybrid', color: '#B10DC9', type: 'vehicle_technology'},
      {value: 'Electric Hybrid', color: '#626f9a', type: 'vehicle_technology'},
      {value: 'Idle Reduction', color: '#01FF70', type: 'vehicle_technology'},
    ]
    this.stations = [
      {value: 'Electric', color: '#0074D9', type: 'charging_fueling_station_technology'},
      {value: 'Biodiesel', color: '#f39c12', type: 'charging_fueling_station_technology'},
      {value: 'E85', color: '#2ECC40', type: 'charging_fueling_station_technology'},
      {value: 'Natural Gas (CNG)', color: '#FFDC00', type: 'charging_fueling_station_technology'},
      {value: 'LPG', color: '#FF4136', type: 'charging_fueling_station_technology'},
      {value: 'Back-up Generator', color: '#7D7F81', type: 'charging_fueling_station_technology'}
    ]
    this.programtypes = [
      {value: 'Grant', type: 'program_type'},
      {value: 'Rebate/Voucher', type: 'program_type'},
      {value: 'Financing', type: 'program_type'},
      {value: 'Tax Credit', type: 'program_type'},
      {value: 'Other', type: 'program_type'}
    ]
    this.program_names = [
      {value: 'Energy Efficient Appliance Rebate Program', type: 'program_name'},
      {value: 'EmPOWER Maryland Challenge - C&I Grant Program', type: 'program_name'},
      {value: 'EECBG Building Retrofit', type: 'program_name'},
      {value: 'Maryland Statewide Farm Energy Audit Program', type: 'program_name'},
      {value: 'Home Performance Rebate Program', type: 'program_name'},
      {value: 'EmPOWER Clean Energy Communities Low-to-Moderate Income Grant Program', type: 'program_name'},
      {value: 'Kathleen A.P. Mathias Agriculture Energy Efficiency Grant Program', type: 'program_name'},
      {value: 'Maryland Home Energy Loan Program', type: 'program_name'},
      {value: 'Maryland Smart Energy Communities', type: 'program_name'},
      {value: 'Energy and Water Conservation in Maryland State Parks', type: 'program_name'},
      {value: 'Energy Performance Contracting', type: 'program_name'},
      {value: 'State Agency Loan Program', type: 'program_name'}
    ]
    this.sectors = [
      {value: 'Residential', color: '#cc6060', type: 'sector'},
      {value: 'Commercial', color: '#62a8c4', type: 'sector'},
      {value: 'Agriculture', color: '#91d667', type: 'sector'},
      {value: 'Local Government', color: '#ced25d', type: 'sector'},
      {value: 'State Government', color: '#d46e12', type: 'sector'}
    ]
    this.sectors2 = _.clone(this.sectors)
    this.sectors2.splice(2,1)
    this.filter_hash = {
      'efficiency': this.sectors.concat(this.program_names),
      'renewable': this.sectors.concat(this.renewables),
      'transportation': this.sectors2.concat(this.stations).concat(this.vehicle_technology)
    }
    this.filterCollection.add(this.filter_hash[this.activetab])
  },
  renderChart: function(chart) {
    var view = {}
    if (chart.get('chart_type') === 'map') {
      this.mapView = new MapView({
        model: chart
      })

      this.$el.find('.charts > .row').append(this.mapView.render().el)
      this.mapView.makeMap()
    } else {
      if (!chart.get('filter_color') && this.tab_colors[this.activetab]) {
        chart.set('colors', [this.tab_colors[this.activetab]])
      }
      view = this.makeChartView(chart)
      var container = $('<div class="chart-container"/>')
      container.append(view.render().el)
      this.$el.find('.charts > .row').append(container)
      setTimeout(function(){view.resize()}, 100)
    }
  },
  makeChartView: function(chart) {
    var view
    switch (chart.get('chart_type')) {
      case 'bar':
        view = new BarChartView({
          model: chart
        })
        break
      case 'stacked':
        view = new StackedBarChartView({
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
    return view
  },
  render: function() {
    this.$el.html(this.template())

    this.chartCollection.add(this.mapModel)

    this.filterMenuView = new FilterMenuView()
    this.$el.find('.charts > .row').append(this.filterMenuView.render().el)

    this.filterMenuView.update()

    this.chartCollection.add(this.chart_hash[this.activetab])

    return this
  },
  update: function(e) {
    var self = this
    this.updateChartCollection()
    this.chartCollection.each(function(chart) {
      chart.update()
    })
  },
  updateChartCollection: function() {
    var self = this
    var tech_filters = this.filterCollection.where({active: true, type: 'technology'})
    if (tech_filters.length === 1) {
      var new_charts = []
      this.chart_hash['capacity_charts'].forEach(function(chart) {
        chart = _.clone(chart)
        var chart_exits = self.chartCollection.where({api: chart.api})
        if (chart_exits.length === 0) {
          chart.title = tech_filters[0].get('value') + ' ' + chart.title
          chart.units = tech_filters[0].get('units')
          chart.yLabel = chart.units
          if (chart.chart_type === 'line') {
            chart.colors = [tech_filters[0].get('color')]
          }
          new_charts.push(chart)
        }
      })
      if (new_charts.length) this.capacityCharts = this.chartCollection.add(new_charts)
    } else {
      if (this.capacityCharts) this.chartCollection.remove(this.capacityCharts)
    }
  },
  switchTab: function(tab) {
    $('ul.nav li').removeClass('active')
    $('ul.nav li a[href="#' + tab + '"]').parent().addClass('active')
    var self = this
    if (tab === 'home') {
      $('.charts').hide()
      $('.filter-summary').hide()
      $('.home').show()
    } else {
      $('.home').hide()
      $('.charts').show()
      $('.filter-summary').show()
      if (tab !== this.activetab) {
        this.activetab = tab
        $('.tab-info a').attr('href', self.socrata_links[tab])
        this.mapView.map.invalidateSize()
        var filters = []
        var geos = this.filterCollection.where({geo: true})
        var geotype = this.filterCollection.where({type: 'geotype'})
        this.filterCollection.reset(this.filter_hash[tab].concat(geos).concat(geotype))
        this.filterMenuView.update()

        var charts = []
        this.chartCollection.findWhere({chart_type: 'map'}).set('data', [])
        this.chartCollection.each(function(chart, idx) {
          if (chart.get('chart_type') !== 'map') {
            chart.abort()
            charts.push(chart)
          }
        })
        this.chartCollection.remove(charts)
        this.chartCollection.add(this.chart_hash[tab])
        this.update()
      }
    }
  }
})

module.exports = Dashboard