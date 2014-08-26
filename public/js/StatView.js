var ChartView = require('./ChartView')

var StatView = ChartView.extend({
  template: $('#stat-template').html(),
  format: d3.format('$,'),
  events: function(){
    return _.extend({}, ChartView.prototype.events,{
      
    })
  },
  render: function() {
    var self = this
    this.$el.html(Mustache.render(this.template, this.model.toJSON(), {
      title: $('#title-partial').html()
    }))
    this.$el.find('.chart-inner').css('overflow', 'hidden')
    this.chart = false
    return this
  },
  update: function() {
    this.resize()
    var round = d3.format('.2')
    var data = this.model.get('data')[0]
    var stat = {}
    var i = (parseFloat(data.project_cost) - parseFloat(data.contribution))/parseFloat(data.contribution)
    stat.investment_leverage = d3.round(i, 2)
    stat.contribution = this.format(data.contribution)
    var html = '<ul>'
    html += '<li>MEA Contribution: <b>' + stat.contribution + '</b></li>'
    html += '<li>Investment Leverage: <b>' + stat.investment_leverage + '</b></li>'
    html += '<li>Total Projects: <b>' + data.total_projects + '</b></li>'
    html += '</ul>'
    this.$el.find('.stat').html(html)
  },
  prepData: function(data){
    return data
  }
})

module.exports = StatView