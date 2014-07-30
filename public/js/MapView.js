var Backbone = require('backbone')
  , _ = require('underscore')

Backbone.$ = $

var MapView = Backbone.View.extend({
  mapTemplate: $('#map-template').html(),
  className: 'map',
  initialize: function() {
    this.render()
    Dashboard.filterCollection.on('all', this.update, this)
  },
  render: function() {
    return this
  },
  makeMap: function() {
    var self = this
    this.map = L.map(this.el).setView([39, -77], 7)
    this.makeLayers()
    this.map.on('moveend', function(e){
      console.log(self.map.getCenter())
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

    var mapbox = L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.map-y9awf40v/{z}/{x}/{y}.png')
    mapbox.addTo(self.map)

    $.when(
      $.getJSON('../../data/mdcnty.json', function(json) {
        self.geomLayer = L.geoJson(json, {
          style: self.style,
          onEachFeature: self.onEachFeature.bind(self)
        }).addTo(self.map)
      })
    ).then(function() {

      var baseMaps = {
        "Streets": mapbox
      }

      var overlayMaps = {
        "Counties": self.geomLayer
      }

      L.control.layers(baseMaps, overlayMaps).addTo(self.map)
    })
  },
  onEachFeature: function(feature, layer) {
    var self = this
    layer.on('click', function(e){
      var name = e.target.feature.properties.name
      var filter = Dashboard.filterCollection.findWhere({type: 'geo', value: name})
      if (filter) {
        layer.setStyle(self.style)
        filter.destroy()
      } else {
        layer.setStyle(self.selectedStyle)
        Dashboard.filterCollection.add({
          value: name,
          type: 'geo'
        })
      }
    })
  },
  update: function() {

  }
})

module.exports = MapView