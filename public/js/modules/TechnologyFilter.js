var FilterLabelView = require('./FilterLabelView')
  , templates = require('./templates')(Handlebars)

var TechnologyFilter = FilterLabelView.extend({
  template: templates['project-type']
})

module.exports = TechnologyFilter