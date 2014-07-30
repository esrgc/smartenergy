var Backbone = require('backbone')
Backbone.$ = $

var FilterLabelView = Backbone.View.extend({
  template: $('#filter-label-template').html(),
  tagName: 'div',
  className: 'filter-label',
  events: {
    'change input': 'activate'
  },
  initialize: function() {
    this.listenTo(this.model, 'change', this.render)
    this.listenTo(this.model, 'destroy', this.remove)
  },
  render: function() {
    this.$el.html(Mustache.render(this.template, this.model.toJSON()))
    this.$el.find('.swatch').css('background-color', this.model.get('color'))
    return this
  },
  activate: function(filter, e){
    console.log(this.model)
  }
})

module.exports = FilterLabelView