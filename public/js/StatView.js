var Backbone = require('backbone')
  , _ = require('underscore')
  , ChartView = require('./ChartView')

Backbone.$ = $

var StatView = ChartView.extend({
  template: $('#stat-template').html(),
  format: d3.format(','),
  events: function(){
    return _.extend({}, ChartView.prototype.events,{
      
    })
  },
  render: function() {
    var self = this
    this.$el.html(Mustache.render(this.template, this.model.toJSON(), {
      title: $('#title-partial').html()
    }))
    this.$el.find('.chart-inner').css('overflow', 'hidden')
    this.chart = false
    return this
  },
  update: function() {
    var stat = this.prepData(this.model.get('data'))
    console.log(stat)
    this.$el.find('.stat span').html(stat)
    //this.chart.update(this.prepData(this.model.get('data')))
  },
  prepData: function(data){
    var stat = this.model.get('data')[this.model.get('key')]
    if (this.model.get('format')) {
      var format = this.model.get('format')
    } else {
      var format = this.format
    }
    return format(stat)
  }
})

module.exports = StatView