var ChartModel = require('./ChartModel')
  , FilterModel = require('./FilterModel')
  , templates = require('./templates')(Handlebars)

var MapView = Backbone.View.extend({
  template: templates.map,
  layers_template: templates.layers,
  templates: {
    'renewable': templates['renewable-popup'],
    'efficiency': templates['efficiency-popup'],
    'transportation': templates['transportation-popup']
  },
  technology_fields: {
    'renewable': ['technology'],
    'efficiency': ['sector'],
    'transportation': ['charging_fueling_station_technology', 'vehicle_technology']
  },  
  color_fields: {
    'renewable': 'technology',
    'efficiency': 'sector',
    'transportation': 'charging_fueling_station_technology'
  },  
  events: {
    'click .layerToggle': 'layerToggle'
  },
  initialize: function() {
    this.render()
    this.listenTo(this.model, 'change:data', this.update, this)
    this.listenTo(Dashboard.filterCollection, 'remove', this.updateGeoFilters, this)
    this.listenTo(this.model, 'change:loading', this.loading)
  },
  render: function() {
      this.$el.html(this.template())
    return this
  },
  makeMap: function() {
    var self = this
    var el = this.$el.find('.map').get(0)
    this.map = L.map(el, {
      attributionControl: false,
      minZoom: 7,
      maxZoom: 16,
      defaultExtentControl: true
    }).setView([39, -77], 7)
    self.$el.find('.map').find('.leaflet-top.leaflet-right').html('<div class="loader"><i class="fa fa-circle-o-notch fa-spin"></i></div>')
    self.$el.find('.map').find('.leaflet-bottom.leaflet-right').html('<div id="mouseover" class="layerToggle"></div>')
    this.makeLayers()
  },
  makeLayers: function() {
    var self = this
    this.style = {
      "color": "#333",
      "weight": 1,
      "opacity": 0.65,
      "fillOpacity": 0.1,
      "fillColor": "#A9C783"
    }
    this.selectedStyle = JSON.parse(JSON.stringify(this.style))
    this.selectedStyle.fillOpacity = 0.4

    this.circlestyle = {
      radius: 4,
      fillColor: "#f00",
      color: "#333",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
      projects: 1
    }

    var mapbox = L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.map-y9awf40v/{z}/{x}/{y}.png')
    mapbox.addTo(self.map)

    this.projects = L.markerClusterGroup({
      maxClusterRadius: 50,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      polygonOptions: {
        color: '#2B4E72',
        weight: 2,
        fillColor: '#333',
        fillOpacity: 0.1
      },
      iconCreateFunction: function(cluster) {
        var markers = cluster.getAllChildMarkers()
        var num_projects = 0
        var tech = []
        var tech_fields = []
        _.each(markers, function(m) {
          if (m.options.projects) {
            num_projects += m.options.projects
          }
          if (m.options.tech) tech.push(m.options.tech)
          if (m.options.tech_field) tech_fields.push(m.options.tech_field)
        })
        tech = _.uniq(tech)
        tech_fields = _.uniq(tech_fields)
        if (tech.length === 1) {
          var className = tech[0]
        } else {
          var className = 'multiple'
        }
        if (tech_fields.length === 1) {
          className += ' ' + tech_fields[0]
        }
        return new L.DivIcon({
          className: 'projects-icon ' + className + ' ' + Dashboard.activetab,
          html: num_projects,
          iconSize: L.point(30, 30)
        })
      }
    }).addTo(self.map)

    $.when(
      $.getJSON('data/maryland-single.json', function(json) {
        self.maryland = L.geoJson(json, {
          style: self.style,
          name: 'state'
        })
      }),
      $.getJSON('data/maryland-counties.json', function(json) {
        self.counties = L.geoJson(json, {
          style: self.style,
          onEachFeature: self.onEachFeature.bind(self),
          name: 'county'
        }).addTo(self.map)
        var f = new FilterModel({
          value: self.counties.options.name,
          type: 'geotype'
        }).on('change:value', function(e) {
          _.each(Dashboard.chartCollection.where({geo: true}), function(chart) {
            chart.update()
          })
        })
        Dashboard.filterCollection.add(f)
      }),
      $.getJSON('data/maryland-legislative-districts.json', function(json) {
        self.legislativeDistricts = L.geoJson(json, {
          style: self.style,
          onEachFeature: self.onEachFeature.bind(self),
          name: 'legislative'
        })
      }),
      $.getJSON('data/maryland-congressional-districts.json', function(json) {
        self.congressionalDistricts = L.geoJson(json, {
          style: self.style,
          onEachFeature: self.onEachFeature.bind(self),
          name: 'congressional'
        })
      }),
      $.getJSON('data/maryland-zips.json', function(json) {
        self.zips = L.geoJson(json, {
          style: self.style,
          onEachFeature: self.onEachFeature.bind(self),
          name: 'zipcode'
        })
      })
    ).then(function() {

      self.layer_switcher = {layers: [
        {name: "Maryland", id: "state", layer: self.maryland, type: 'base'},
        {name: "Counties", id: "county", layer: self.counties, type: 'base'},
        {name: "Leg. Dist.", id: "legislative", layer: self.legislativeDistricts, type: 'base'},
        {name: "Cong. Dist.", id: "congressional", layer: self.congressionalDistricts, type: 'base'},
        {name: "Zip Codes", id: "zipcode", layer: self.zips, type: 'base'},
        {name: "Individual Projects", id: "projects", layer: self.projects, type: 'overlay'}
      ]}
      var layers_html = self.layers_template(self.layer_switcher)
      self.$el.find('.map').find('.leaflet-bottom.leaflet-left').html(layers_html)
      self.$el.find('#county').find('p').addClass('active')
      self.$el.find('#projects').find('p').addClass('active')
    })
  },
  makePopup: function(features, latlng, tech_field) {
    var self = this
    var money = d3.format('$,.2f')
    var content = '<div class="map-projects">'
    _.each(features, function(feature) {
      var i = (parseFloat(feature.total_project_cost) - parseFloat(feature.mea_award))/parseFloat(feature.mea_award) || 0
      feature.investment_leverage = d3.round(i, 2)
      if (feature.mea_award) {
        feature.mea_award = money(feature.mea_award)
      }
      if (feature.other_agency_dollars) {
        feature.other_agency_dollars = money(feature.other_agency_dollars)
      } else {
        feature.other_agency_dollars = money(0)
      }
      if (feature.total_project_cost) {
        feature.total_project_cost = money(feature.total_project_cost)
      }
      feature.color = '#bbb'
      //var color_field = self.color_fields[Dashboard.activetab]
      if (feature[tech_field]) {
        var filter = Dashboard.filterCollection.where({value: feature[tech_field]})
        if (filter.length) {
          feature.color = filter[0].get('color')
        }
      }
      content += self.templates[Dashboard.activetab](feature)
    })
    content += '</div>'
    return content
  },
  layerToggle: function(e) {
    var self = this
    var id = $(e.currentTarget).attr('id')
    var layer = _.findWhere(this.layer_switcher.layers, {id: id})
    if (layer && layer.type === 'overlay') {
      if (self.map.hasLayer(layer.layer)) {
        this.map.removeLayer(layer.layer)
        $(e.currentTarget).find('p').removeClass('active')
        this.model.set('visible', false)
      } else {
        this.map.addLayer(layer.layer)
        $(e.currentTarget).find('p').addClass('active')
        this.model.set('visible', true)
      }
    } else if (layer.type === 'base') {
      if (!this.map.hasLayer(layer.layer)) {
        var base = _.where(this.layer_switcher.layers, {type: 'base'})
        _.each(base, function(l) {
          self.map.removeLayer(l.layer)
          self.$el.find('.layerToggle#' + l.id).find('p').removeClass('active')
        })
        var geofilters = Dashboard.filterCollection.where({geo: true})
        Dashboard.filterCollection.remove(geofilters)
        this.map.addLayer(layer.layer)
        $(e.currentTarget).find('p').addClass('active')
        Dashboard.filterCollection.findWhere({type: 'geotype'}).set('value', layer.id)
      }
    }
  },
  onEachFeature: function(feature, layer) {
    var self = this
    layer.on('click', function(feature, layer, e){
      var options = layer.options || layer._options
      var name = feature.properties.name
      var filter = Dashboard.filterCollection.findWhere({type: options.name, value: name})
      if (filter) {
        layer.setStyle(self.style)
        Dashboard.filterCollection.remove(filter)
      } else {
        layer.setStyle(self.selectedStyle)
        var f = new FilterModel({
          value: name,
          type: options.name,
          active: true,
          geo: true
        })
        Dashboard.filterCollection.add(f)
      }
    }.bind(this, feature, layer))
    layer.on('mouseover', function(layer, e) {
      var options = layer.options || layer._options
      var name = e.target.feature.properties.name
      if (options.name === 'congressional') {
        name = name.replace('24', '')
      }
      self.$el.find('.map').find('#mouseover').html(name)
      self.$el.find('.map').find('#mouseover').show()
    }.bind(this, layer))
    layer.on('mouseout', function(e) {
      self.$el.find('.map').find('#mouseover').hide()
    })
  },
  updateGeoFilters: function(filter) {
    var self = this
    if (filter.get('geo')) {
      var layer = _.where(this.layer_switcher.layers, {id: filter.get('type')})[0].layer
      layer.eachLayer(function(l) {
        if(l.feature.properties.name === filter.get('value')) {
          l.setStyle(self.style)
        }
      })
    }
  },
  update: function() {
    var self = this
    self.projects.clearLayers()
    self.map.closePopup()
    _.each(this.model.get('data').points, function(point) {
      if (point.point) {
        var latlng = point.point.split(',').map(parseFloat)
        var technology_fields = self.technology_fields[Dashboard.activetab]
        technology_fields.forEach(function(tech_field, tech_idx) {
          if (point[tech_field] && point[tech_field].length) {
            for(var i = 0; i < point[tech_field].length; i++) {
              var technology = point[tech_field][i].t
              var projects = point[tech_field][i].p
              var tech_filter = tech_field + technology.replace(/ /g, '').replace('(', '').replace(')', '')
              if (projects > 1) {
                var className = 'projects-icon '
                var marker_props = {projects: projects}
                if (tech_field !== 'sector') {
                  className += tech_filter
                  className += ' ' + tech_field
                  marker_props.tech = tech_filter
                  marker_props.tech_field = tech_field
                }
                marker_props.icon = L.divIcon({
                  className: className,
                  html: projects,
                  iconSize: L.point(30, 30)
                })
                var marker = L.marker(latlng, marker_props)
              } else {
                if (technology) {
                  if (tech_field !== 'sector') {
                    self.circlestyle.tech = tech_filter
                    self.circlestyle.tech_field = tech_field
                  }
                  var filter = Dashboard.filterCollection.where({value: technology, type: tech_field})
                  if (filter.length) {
                    if (tech_field === 'sector') {
                      self.circlestyle.fillColor = '#bbb'
                    } else {
                      self.circlestyle.fillColor = filter[0].get('color')
                    }
                    self.circlestyle.radius = 6
                  }
                } else {
                  self.circlestyle.tech = 'multiple'
                  self.circlestyle.fillColor = '#000'
                }
                if (tech_field === 'charging_fueling_station_technology') {
                  var marker_props = {projects: 1}
                  var className = 'projects-icon '
                  className += tech_filter
                  className += ' ' + tech_field
                  marker_props.tech = tech_filter
                  marker_props.tech_field = tech_field
                  marker_props.icon = L.divIcon({
                    className: className,
                    iconSize: L.point(10, 10)
                  })
                  var marker = L.marker(latlng, marker_props)
                } else {
                  var marker = L.circleMarker(latlng, self.circlestyle)
                }
              }
              marker.on('click', self.markerClick.bind(self, point, tech_field, technology, latlng))
              self.projects.addLayer(marker)
            }
          }
        })
      }
    })
  },
  markerClick: function(project, tech_field, technology, latlng, e) {
    var self = this
    var url = 'api/getProjectsByPoint'
    url = self.model.makeQuery(url)
    //url += '&_id=' + project._id
    url += '&point=' + project.point
    url += '&tech=' + technology
    url += '&tech_field=' + tech_field
    var popup = L.popup()
    .setLatLng(latlng)
    .setContent('Loading')
    .openOn(self.map)
    $.getJSON(url, function(res){
      popup.setContent(self.makePopup(res, latlng, tech_field))
    })
  },
  loading: function() {
    this.$el.find('.map').find('.loader').toggle()
  },
  reset: function() {
    this.map.setView([39, -77], 7)
  }
})

module.exports = MapView