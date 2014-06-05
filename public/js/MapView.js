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
    this.map = L.map(this.el).setView([39, -90.79], 3)
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.map-y9awf40v/{z}/{x}/{y}.png')
      .addTo(this.map)
    this.map.on('moveend', function(e){
      console.log(self.map.getCenter())
    })
  },
  update: function() {

  }
})

module.exports = MapView