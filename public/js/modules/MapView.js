var ChartModel = require('./ChartModel')
  , FilterModel = require('./FilterModel')
  , templates = require('./templates')(Handlebars)

var MapView = Backbone.View.extend({
  template: templates.map,
  templates: {
    'renewable': templates['renewable-popup'],
    'efficiency': templates['efficiency-popup'],
    'transportation': templates['transportation-popup']
  },
  color_fields: {
    'renewable': 'technology',
    'efficiency': 'sector',
    'transportation': 'charging_fueling_station_technology'
  },
  layers_template: templates.layers,
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
      minZoom: 7
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
      fillColor: "#999999",
      color: "#000000",
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
      //disableClusteringAtZoom: 10,
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
        _.each(markers, function(m) {
          if (m.options.projects) {
            num_projects += m.options.projects
          }
          if (m.options.tech) tech.push(m.options.tech)
        })
        tech = _.uniq(tech)
        if (tech.length === 1) {
          var className = tech[0]
        } else {
          var className = 'multiple'
        }
        return new L.DivIcon({
          className: 'div-icon ' + className,
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
  makePopup: function(features, latlng) {
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
      var color_field = self.color_fields[Dashboard.activetab]
      if (feature[color_field]) {
        var filter = Dashboard.filterCollection.where({value: feature[color_field]})
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
    layer.on('mouseover', function(e) {
      self.$el.find('.map').find('#mouseover').html(e.target.feature.properties.name)
      self.$el.find('.map').find('#mouseover').show()
    })
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
    _.each(this.model.get('data').points, function(point) {
      if (point.point) {
        var latlng = point.point.split(',').map(parseFloat)
        if (latlng.length == 2) {
          for(var i = 0; i < point.techcount.length; i++) {
            var technology = point.techcount[i].t
            var projects = point.techcount[i].p
            var tech_filter = technology.replace(/ /g, '').replace('(', '').replace(')', '')
            if (projects > 1) {
              var className = 'div-icon projects-icon '
              var marker_props = {projects: projects}
              var filter = Dashboard.filterCollection.where({value: technology})
              var color = filter[0].get('color')
              className += tech_filter
              marker_props.tech = tech_filter
              marker_props.icon = L.divIcon({
                className: className,
                html: projects,
                iconSize: L.point(30, 30)
              })
              var marker = L.marker(latlng, marker_props)
            } else {
              if (technology) {
                self.circlestyle.tech = tech_filter
                var filter = Dashboard.filterCollection.where({value: technology})
                if (filter.length) {
                  self.circlestyle.fillColor = filter[0].get('color')
                  self.circlestyle.radius = 6
                }
              } else {
                self.circlestyle.tech = 'multiple'
                self.circlestyle.fillColor = '#000'
              }
              var marker = L.circleMarker(latlng, self.circlestyle)
            }
            marker.on('click', self.markerClick.bind(self, technology, point, latlng))
            self.projects.addLayer(marker)
          }
        }
      }
    })
  },
  markerClick: function(technology, point, latlng, e) {
    var self = this
    var url = 'api/getProjectsByPoint'
    url = self.model.makeQuery(url)
    url += '&point=' + point.point
    url += '&tech=' + technology
    var popup = L.popup()
    .setLatLng(latlng)
    .setContent('Loading')
    .openOn(self.map)
    $.getJSON(url, function(res){
      popup.setContent(self.makePopup(res, latlng))
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