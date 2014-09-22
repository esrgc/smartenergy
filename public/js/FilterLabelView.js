var FilterLabelView = Backbone.View.extend({
  template: $('#filter-label-template').html(),
  tagName: 'div',
  className: 'filter-label',
  events: {
    'click': 'activate'
  },
  initialize: function() {
    //this.listenTo(this.model, 'change', this.render)
    this.listenTo(this.model, 'remove', this.remove)
  },
  render: function() {
    this.$el.html(Mustache.render(this.template, this.model.toJSON()))
    this.style()
    return this
  },
  style: function() {

  },
  activate: function(filter, e){
    var active = this.model.get('active')
    this.model.set('active', !active)
    this.$el.find('button').toggleClass('active')
  }
})

module.exports = FilterLabelView