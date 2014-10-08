var ChartView = require('./ChartView')

var StatView = ChartView.extend({
  template: $('#stat-template').html(),
  format: d3.format('$,.0f'),
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
    var i = (parseFloat(data.project_cost) - parseFloat(data.contribution))/parseFloat(data.contribution) || 0
    stat.investment_leverage = d3.round(i, 2)
    stat.contribution = this.format(data.contribution)
    stat.project_cost = this.format(data.project_cost)
    stat.sum_other_agency_dollars = this.format(data.sum_other_agency_dollars)
    var html = '<table class="table table-condensed statview">'
    html += '<tr><td>Total Projects</td><td><strong>' + d3.format(',')(data.total_projects) + '</strong></td></tr>'
    html += '<tr><td>Total Project Cost</td><td><strong>' + stat.project_cost + '</strong></td></tr>'
    html += '<tr><td>MEA Contribution</td><td><strong>' + stat.contribution + '</strong></td></tr>'
    html += '<tr><td>Other Agency Dollars</td><td><strong>' + stat.sum_other_agency_dollars + '</strong></td></tr>'
    html += '<tr><td>Investment Leverage</td><td><strong>' + stat.investment_leverage + '</strong></td></tr>'
    html += '</table>'
    this.$el.find('.stat').html(html)
  },
  prepData: function(data){
    return data
  }
})

module.exports = StatView