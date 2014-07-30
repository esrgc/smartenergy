var Backbone = require('backbone')
  , _ = require('underscore')
  , ChartView = require('./ChartView')
  , FilterLabelView = require('./FilterLabelView')

Backbone.$ = $

var FilterMenuView = Backbone.View.extend({
  template: $('#filter-menu-template').html(),
  events: {

  },
  render: function() {
    var self = this
    this.$el.html(Mustache.render(this.template, {title: 'Project Types'}, {
      title: $('#title-partial').html()
    }))
    Dashboard.filterCollection.each(function(filter) {
      self.$el.find('.project-types').append(new FilterLabelView({model: filter}).render().el)
    })
    return this
  },
  update: function() {
  }
})

module.exports = FilterMenuView