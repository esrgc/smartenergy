var Dashboard = require('./modules/Dashboard')
  , Router = require('./modules/Router')

$(function(){
  window.Dashboard = new Dashboard()
  window.Dashboard.render()
  window.Dashboard.router = new Router
  Backbone.history.start()
})