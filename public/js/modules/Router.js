const Router = Backbone.Router.extend({
  routes: {
    ':tab': 'renewable'
  },
  renewable: function(tab) {
    Dashboard.switchTab(tab)
  }
})

module.exports = Router