var templates = require('./templates')(Handlebars)

var FilterLabelView = Backbone.View.extend({
  template: templates['filter-label'],
  tagName: 'div',
  className: 'filter-label',
  events: {
    'click': 'activate'
  },
  initialize: function() {
    this.listenTo(this.model, 'remove', this.remove)
    this.listenTo(this.model, 'change:active', this.changeActive)
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()))
    this.style()
    return this
  },
  style: function() {
    if (this.model.get('color')) {
      if ((this.model.get('type') === 'sector' && Dashboard.activetab === 'efficiency')
         || (Dashboard.activetab !== 'efficiency' && this.model.get('type') !== 'sector')) {
        this.$el.find('button').addClass('colored')
        this.$el.find('button').css('background-color', this.model.get('color'))
      }
    }
  },
  activate: function(filter, e){
    var active = this.model.get('active')
    this.model.set('active', !active)
  },
  changeActive: function() {
    if (this.model.get('active')) {
      this.$el.find('button').addClass('active')
    } else {
      this.$el.find('button').removeClass('active')
    }
  }
})

module.exports = FilterLabelView