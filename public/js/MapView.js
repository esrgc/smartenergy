var ChartModel = require('./ChartModel')

var MapView = Backbone.View.extend({
  template: $('#map-template').html(),
  renewables_template: $('#renewable-popup').html(),
  layers_template: $('#layers-template').html(),
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
    this.$el.html(Mustache.render(this.template))
    return this
  },
  makeMap: function() {
    var self = this
    var el = this.$el.find('.map').get(0)
    this.map = L.map(el, {attributionControl: false}).setView([39, -77], 7)
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
      polygonOptions: {
        color: '#2B4E72',
        weight: 2,
        fillColor: '#2B4E72',
        fillOpacity: 0.1
      },
      iconCreateFunction: function(cluster) {
        var markers = cluster.getAllChildMarkers()
        var num_projects = 0
        _.each(markers, function(m) {
          if (m.options.projects) num_projects += m.options.projects
        })
        return new L.DivIcon({
          className: 'div-icon',
          html: num_projects,
          iconSize: L.point(30, 30)
        })
      }
    }).addTo(self.map)

    $.when(
      $.getJSON('data/maryland-single.json', function(json) {
        self.maryland = L.geoJson(json, {
          style: self.style,
          name: 'maryland'
        }).addTo(self.map)
      }),
      $.getJSON('data/mdcnty.json', function(json) {
        self.counties = L.geoJson(json, {
          style: self.style,
          onEachFeature: self.onEachFeature.bind(self),
          name: 'county'
        })
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
        {name: "Maryland", id: "maryland", layer: self.maryland, type: 'base'},
        {name: "Counties", id: "county", layer: self.counties, type: 'base'},
        {name: "Leg. Dist.", id: "legislative", layer: self.legislativeDistricts, type: 'base'},
        {name: "Cong. Dist.", id: "congressional", layer: self.congressionalDistricts, type: 'base'},
        {name: "Zip Codes", id: "zipcode", layer: self.zips, type: 'base'},
        {name: "Individual Projects", id: "projects", layer: self.projects, type: 'overlay'}
      ]}
      var layers_html = Mustache.render(self.layers_template, self.layer_switcher)
      self.$el.find('.map').find('.leaflet-bottom.leaflet-left').html(layers_html)
      self.$el.find('#maryland').find('p').addClass('active')
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
      if (feature.technology) {
        var filter = Dashboard.filterCollection.where({value: feature.technology})
        if (filter.length) {
          feature.color = filter[0].get('color')
        }
      }
      content += Mustache.render(self.renewables_template, feature)
    })
    content += '</div>'
    return content
  },
  layerToggle: function(e) {
    var self = this
    var id = $(e.target).parent().attr('id')
    var layer = _.findWhere(this.layer_switcher.layers, {id: id})
    if (layer && layer.type === 'overlay') {
      if (self.map.hasLayer(layer.layer)) {
        this.map.removeLayer(layer.layer)
        $(e.target).removeClass('active')
        this.model.set('visible', false)
      } else {
        this.map.addLayer(layer.layer)
        $(e.target).addClass('active')
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
        $(e.target).addClass('active')
      }
    }
  },
  onEachFeature: function(feature, layer) {
    var self = this
    layer.on('click', function(e){
      var name = e.target.feature.properties.name
      var filter = Dashboard.filterCollection.findWhere({type: e.layer.options.name, value: name})
      if (filter) {
        e.layer.setStyle(self.style)
        filter.destroy()
      } else {
        e.layer.setStyle(self.selectedStyle)
        Dashboard.filterCollection.add({
          value: name,
          type: e.layer.options.name,
          active: true,
          geo: true
        })
      }
    })
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
    _.each(this.model.get('data'), function(features) {
      var feature = features[0]
      if (feature.point) {
        var latlng = feature.point.split(',').map(parseFloat)
        if (latlng.length == 2) {
          if (features.length > 1) {
            var myIcon = L.divIcon({
              className: 'div-icon projects-icon',
              html: features.length,
              iconSize: L.point(30, 30)
            })
            var marker = L.marker(latlng, {icon: myIcon, projects: features.length})
          } else {
            if (feature.technology) {
              var filter = Dashboard.filterCollection.where({value: feature.technology})
              if (filter.length) {
                self.circlestyle.fillColor = filter[0].get('color')
                self.circlestyle.radius = 4
              }
            }
            var marker = L.circleMarker(latlng, self.circlestyle)
          }
          marker.on('click', function(point, latlng, e) {
            var url = 'api/getProjectsByPoint'
            url = self.model.makeQuery(url)
            url += '&point=' + point.point
            var popup = L.popup()
            .setLatLng(latlng)
            .setContent('Loading')
            .openOn(self.map)
            $.getJSON(url, function(res){
              popup.setContent(self.makePopup(res, latlng))
            })
          }.bind(this, feature, latlng))
          self.projects.addLayer(marker)
        }
      }
    })
  },
  loading: function() {
    this.$el.find('.map').find('.loader').toggle()
  }
})

module.exports = MapView