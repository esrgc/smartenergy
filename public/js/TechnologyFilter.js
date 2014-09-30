var FilterLabelView = require('./FilterLabelView')

var TechnologyFilter = FilterLabelView.extend({
  template: $('#project-type-filter').html(),
  style: function() {
    this.$el.find('button').css('background-color', this.model.get('color'))
  }
})

module.exports = TechnologyFilter