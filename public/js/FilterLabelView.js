var Backbone = require('backbone')
Backbone.$ = $

var FilterLabelView = Backbone.View.extend({
  template: $('#filter-label-template').html(),
  tagName: 'div',
  className: 'filter-label',
  events: {
    'click .remove': 'removeFilter'
  },
  initialize: function() {
    this.listenTo(this.model, 'change', this.render)
    this.listenTo(this.model, 'destroy', this.remove)
  },
  render: function() {
    this.$el.html(Mustache.render(this.template, this.model.toJSON()))
    return this
  },
  removeFilter: function(){
    this.model.destroy()
  }
})

module.exports = FilterLabelView