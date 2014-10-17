var createcss = require('createcss')

var FilterModel = Backbone.Model.extend({
  defaults: function() {
    return {
      active: false
    }
  },
  initialize: function(){
    if(!this.get('display')) {
      this.set('display', this.get('value'))
    }
    if (this.get('color')) {
      createcss.selector('.' + this.get('value').replace(/ /g, ''), 'background: ' + this.get('color'))
    }
  }
})

module.exports = FilterModel