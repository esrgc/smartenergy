var Backbone = require('backbone')
  , _ = require('underscore')
Backbone.$ = $

var ChartModel = Backbone.Model.extend({
  defaults: function() {
    return {
      api: '/',
      title: 'Chart Title',
      sort_key: false,
      sort_desc: true,
      chart_type: 'bar',
      key: 'Name'
    }
  },
  initialize: function() {

  },
  update: function(filters) {
    var self = this
    var url = this.get('api')
    url += '?'
    Dashboard.filterCollection.each(function(filter) {
      if (filter.get('active')) {
        url += filter.get('type') + '=' + filter.get('value') + '&'
      }
    })
    console.log(url)
    $.getJSON(url, function(res){
      self.set('data', res)
    })
  },
  sortByKey: function(column) {
    var data = this.get('data')
    if(!this.get('sort_key')) {
      this.set('sort_key', column)
      this.set('sort_desc', true)
    } else if(this.get('sort_key') === column) {
      var sort_order = this.get('sort_desc')
      this.set('sort_desc', !sort_order)
    } else if(this.get('sort_key') !== column) {
      this.set('sort_key', column)
      this.set('sort_desc', true)
    }
    if(this.get('sort_desc')){
      data = _.sortBy(data, function(obj){ return obj[column] }).reverse()
    } else {
      data = _.sortBy(data, function(obj){ return obj[column] })
    }
    this.set('data', data)
  }
})

module.exports = ChartModel