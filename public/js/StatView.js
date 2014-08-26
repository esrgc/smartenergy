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
    var stat = this.prepData(this.model.get('data'))
    var html = '<ul>'
    html += '<li>MEA Contribution: <b>' + stat.contribution + '</b></li>'
    html += '<li>Investment Leverage: <b>' + stat.investment_leverage + '</b></li>'
    html += '<li>Total Projects: <b>' + stat.total_projects + '</b></li>'
    html += '</ul>'
    this.$el.find('.stat').html(html)
  },
  prepData: function(data){
    var data = data[0]
    var round = d3.format('.2')
    var i = (parseFloat(data.project_cost) - parseFloat(data.contribution))/parseFloat(data.contribution)
    data.investment_leverage = d3.round(i, 2)
    data.contribution = this.format(data.contribution)
    return data
  }
})

module.exports = StatView