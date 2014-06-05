var Backbone = require('backbone')
Backbone.$ = $

var FilterModel = Backbone.Model.extend({
  defaults: function() {
    return {
    }
  },
  initialize: function(){
    if(!this.get('display')) {
      this.set('display', this.get('value'))
    }
  }
})

module.exports = FilterModel