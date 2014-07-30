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
    var style = {
      "color": "#333",
      "weight": 1,
      "opacity": 0.65,
      "fillOpacity": 0.1,
      "fillColor": "#2B4E72"
    }

    var mapbox = L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.map-y9awf40v/{z}/{x}/{y}.png')
    mapbox.addTo(self.map)

    $.when(
      $.getJSON('../../data/maryland.json', function(json) {
        self.stateLayer = L.geoJson(json, {
          style: style
        }).addTo(self.map)
      }),
      $.getJSON('../../data/mdcnty.json', function(json) {
        self.countyLayer = L.geoJson(json, {
          style: style
        })
      }),
      $.getJSON('../../data/maryland-legislative-districts.json', function(json) {
        self.legislativeLayer = L.geoJson(json, {
          style: style
        })
      })
    ).then(function() {

      var baseMaps = {
        "Streets": mapbox
      }

      var overlayMaps = {
        "State": self.stateLayer,
        "Counties": self.countyLayer,
        "Legislative Districts": self.legislativeLayer
      }

      L.control.layers(baseMaps, overlayMaps).addTo(self.map)
    })
  },
  update: function() {

  }
})

module.exports = MapView