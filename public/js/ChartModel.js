
var ChartModel = Backbone.Model.extend({
  defaults: function() {
    return {
      api: '/',
      title: 'Chart Title',
      sort_key: false,
      sort_desc: true,
      chart_type: 'bar',
      key: 'Name',
      loading: false,
      hoverTemplate: '{{label}}: {{value}}',
      units: '',
      visible: true
    }
  },
  initialize: function() {
    this.set('hoverTemplate', '{{label}}: {{value}} ' + this.get('units'))
    this.listenTo(this, 'change:visible', this.update)
  },
  update: function() {
    var self = this
    if (this.get('visible')) {
      this.set('loading', true)
      this.clearData()
      if (this.request && this.request.readyState !== 4) {
        this.request.abort()
      }
      var url = this.makeQuery()
      this.request = $.getJSON(url, function(res){
        self.set('loading', false)
        self.set('data', res)
      })
    }
  },
  makeQuery: function() {
    var url = this.get('api')
    url += '?'
    Dashboard.filterCollection.each(function(filter) {
      if (filter.get('active')) {
        url += filter.get('type') + '=' + filter.get('value') + '&'
      }
    })
    url += 'tab=' + Dashboard.activetab
    return url
  },
  clearData: function() {
    var data = this.get('data')
    if (data && data[0]) {
      if (this.get('chart_type') === 'stat') {
        var keys = _.keys(data[0])
      } else {
        var keys = _.without(_.keys(data[0]), this.get('key'))
      }
      data.forEach(function(row) {
        keys.forEach(function(key) {
          row[key] = 0
        })
      })
      this.set('data', data)
      this.trigger('change:data')
    }
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