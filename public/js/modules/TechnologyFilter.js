const FilterLabelView = require('./FilterLabelView')
const templates = require('./templates')(Handlebars)

const TechnologyFilter = FilterLabelView.extend({
  template: templates['project-type']
})

module.exports = TechnologyFilter