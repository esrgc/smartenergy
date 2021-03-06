const createcss = require('createcss')

const FilterModel = Backbone.Model.extend({
  defaults: function() {
    return {
      active: false,
      visible: true
    }
  },
  initialize: function(){
    if(!this.get('display')) {
      this.set('display', this.get('value'))
    }
    if (this.get('color')) {
      createcss.selector('.' + this.get('type') + this.get('value').replace(/ /g, '').replace('(', '').replace(')', ''), 'background: ' + this.get('color'))
    }
  }
})

module.exports = FilterModel