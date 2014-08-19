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
  }
})

module.exports = FilterModel