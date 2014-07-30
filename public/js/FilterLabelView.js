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
    if (this.model.get('active')) {
      this.$el.find('input').attr('checked', 'checked')
    }
    this.style()
    return this
  },
  style: function() {

  },
  activate: function(filter, e){
    var active = this.model.get('active')
    this.model.set('active', !active)
    if (active) {

    } else {

    }
    console.log(this.model)
  }
})

module.exports = FilterLabelView