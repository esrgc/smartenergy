var Dashboard = require('./Dashboard')
  , Router = require('./Router')

$(function(){
  window.Dashboard = new Dashboard()
  window.Dashboard.render()
  window.Dashboard.router = new Router
  Backbone.history.start()
})