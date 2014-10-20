var FilterLabelView = require('./FilterLabelView')

var TechnologyFilter = FilterLabelView.extend({
  template: $('#project-type-filter').html()
})

module.exports = TechnologyFilter