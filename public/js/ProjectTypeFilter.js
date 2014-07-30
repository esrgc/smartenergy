var Backbone = require('backbone')
  , FilterLabelView = require('./FilterLabelView')
Backbone.$ = $

var ProjectTypeFilter = FilterLabelView.extend({
  template: $('#project-type-filter').html(),
  style: function() {
    this.$el.find('.swatch').css('background-color', this.model.get('color'))
  }
})

module.exports = ProjectTypeFilter