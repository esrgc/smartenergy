var MapView = Backbone.View.extend({
  template: $('#map-template').html(),
  renewables_template: $('#renewable-popup').html(),
  initialize: function() {
    this.render()
    this.listenTo(this.model, 'change:data', this.update, this)
    this.listenTo(Dashboard.filterCollection, 'remove', this.updateGeoFilters, this)
  },
  render: function() {
    this.$el.html(Mustache.render(this.template))
    return this
  },
  makeMap: function() {
    var self = this
    var el = this.$el.find('.map').get(0)
    this.map = L.map(el).setView([39, -77], 7)
    this.makeLayers()
    this.map.on('moveend', function(e){
      console.log(self.map.getCenter())
    })
    this.map.on('baselayerchange', function(e) {
      var geofilters = Dashboard.filterCollection.where({geo: true})
      Dashboard.filterCollection.remove(geofilters)
    })
  },
  makeLayers: function() {
    var self = this
    this.style = {
      "color": "#333",
      "weight": 1,
      "opacity": 0.65,
      "fillOpacity": 0.1,
      "fillColor": "#2B4E72"
    }
    this.selectedStyle = JSON.parse(JSON.stringify(this.style))
    this.selectedStyle.fillOpacity = 0.9

    this.circlestyle = {
      radius: 3,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }

    var mapbox = L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.map-y9awf40v/{z}/{x}/{y}.png')
    mapbox.addTo(self.map)

    this.projects = L.featureGroup()

    $.when(
      $.getJSON('data/maryland-single.json', function(json) {
        self.maryland = L.geoJson(json, {
          style: self.style,
          name: 'maryland'
        }).addTo(self.map)
      }),
      $.getJSON('data/mdcnty.json', function(json) {
        self.geomLayer = L.geoJson(json, {
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

      var baseMaps = {
        "Maryland": self.maryland,
        "Counties": self.geomLayer,
        "Legislative Districts": self.legislativeDistricts,
        "Congressional Districts": self.congressionalDistricts,
        "Zip Codes": self.zips
      }

      var overlayMaps = {
        "Individual Projects": self.projects
      }

      self.layer_hash = {
        "maryland": self.maryland,
        "county": self.geomLayer,
        "legislative": self.legislativeDistricts,
        "congressional": self.congressionalDistricts,
        "zipcode": self.zips,
        "projects": self.projects
      }

      L.control.layers(baseMaps, overlayMaps).addTo(self.map)
    })
  },
  onEachFeature: function(feature, layer) {
    var self = this
    layer.on('click', function(e){
      var name = e.target.feature.properties.name
      var filter = Dashboard.filterCollection.findWhere({type: layer.options.name, value: name})
      if (filter) {
        layer.setStyle(self.style)
        filter.destroy()
      } else {
        layer.setStyle(self.selectedStyle)
        Dashboard.filterCollection.add({
          value: name,
          type: layer.options.name,
          active: true,
          geo: true
        })
      }
    })
  },
  updateGeoFilters: function(filter) {
    var self = this
    if (filter.get('geo')) {
      var layer = this.layer_hash[filter.get('type')]
      layer.eachLayer(function(l) {
        if(l.feature.properties.name === filter.get('value')) {
          console.log(l)
          l.setStyle(self.style)
        }
      })
    }
  },
  update: function() {
    var self = this
    self.projects.clearLayers()
    _.each(this.model.get('data'), function(feature) {
      if (feature.point) {
        var latlng = feature.point.split(',').map(parseFloat)
        if (latlng.length == 2) {
          var filter = Dashboard.filterCollection.where({value: feature.technology})
          if (filter.length) {
            self.circlestyle.fillColor = filter[0].get('color')
          }
          var marker = L.circleMarker(latlng, self.circlestyle)
          marker.bindPopup(self.makePopup(feature))
          self.projects.addLayer(marker)
        }
      }
    })
  },
  makePopup: function(feature) {
    if (feature.mea_award) {
       feature.mea_award = d3.format('$,')(feature.mea_award)
    }
    return Mustache.render(this.renewables_template, feature)
  }
})

module.exports = MapView