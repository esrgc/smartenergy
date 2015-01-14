var ChartView = require('./ChartView')
  , templates = require('./templates')(Handlebars)

var StatView = ChartView.extend({
  template: templates.stat,
  format: d3.format('$,.0f'),
  events: function(){
    return _.extend({}, ChartView.prototype.events,{
      
    })
  },
  render: function() {
    var self = this
    this.$el.html(this.template(this.model.toJSON()))
    this.$el.find('.chart-inner').css('overflow', 'hidden')
    this.chart = false
    return this
  },
  update: function() {
    this.resize()
    var round = d3.format('.2')
    console.log(this.model.get('data'))
    if (this.model.get('data').length) {
      this.empty(false)
      var data = this.model.get('data')[0]
      var stat = {}
      if (data.il_contribution === 0) {
        var i = 0
      } else {
        var i = (parseFloat(data.il_project_cost) - parseFloat(data.il_contribution))/parseFloat(data.il_contribution) || 0
      }
      stat.investment_leverage = d3.round(i, 2)
      stat.contribution = this.format(data.contribution)
      stat.project_cost = this.format(data.project_cost)
      stat.sum_other_agency_dollars = this.format(data.sum_other_agency_dollars)
      var html = '<table class="table table-condensed statview">'
      html += '<tr><td>Total Projects</td><td>' + d3.format(',')(data.total_projects) + '</td></tr>'
      html += '<tr><td>Total Project Cost</td><td>' + stat.project_cost + '</td></tr>'
      html += '<tr><td>MEA Contribution</td><td>' + stat.contribution + '</td></tr>'
      html += '<tr><td>Investment Leverage</td><td>' + stat.investment_leverage + '</td></tr>'
      html += '</table>'
      this.$el.find('.stat').html(html)
    } else {
      this.empty(true)
    }
  },
  prepData: function(data){
    return data
  }
})

module.exports = StatView