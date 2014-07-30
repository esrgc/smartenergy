var Backbone = require('backbone')
  , _ = require('underscore')
  , ChartView = require('./ChartView')
  , ProjectTypeFilter = require('./ProjectTypeFilter')
  , GranteeFilter = require('./GranteeFilter')

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
      if (filter.get('type') === 'project') {
        self.$el.find('.project-types').append(new ProjectTypeFilter({model: filter}).render().el)
      } else if (filter.get('type') === 'grantee') {
        self.$el.find('.grantees').append(new GranteeFilter({model: filter}).render().el)
      }
    })
    return this
  },
  update: function() {
  }
})

module.exports = FilterMenuView