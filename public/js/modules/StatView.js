const ChartView = require('./ChartView')
const templates = require('./templates')(Handlebars)

const StatView = ChartView.extend({
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
    if (Dashboard.activetab === 'efficiency') {
      this.$el.find('.efficiency-note').show()
    } else {
      this.$el.find('.efficiency-note').hide()
    }
    if (this.model.get('data').length) {
      this.empty(false)
      var data = this.model.get('data')[0]
      var stat = {}
      stat.contribution = this.format(data.contribution)
      stat.sum_other_agency_dollars = this.format(data.sum_other_agency_dollars)
      if (data.il_contribution === 0 || data.il_project_cost === 0) {
        stat.investment_leverage = 'Not Available'
      } else {
        var i = (parseFloat(data.il_project_cost) - parseFloat(data.il_contribution))/parseFloat(data.il_contribution) || 0
        stat.investment_leverage = d3.round(i, 2)
      }
      if (data.project_cost === 0) {
        stat.project_cost = 'Not Available'
      } else {
        stat.project_cost = this.format(data.project_cost)
      }
      if (data.electricity_savings_kwh) {
        stat.electricity_savings_kwh = d3.round(data.electricity_savings_kwh, 0)
      }
      var html = '<table class="table table-condensed statview">'
      html += '<tr><td>Total Projects</td><td>' + d3.format(',')(data.total_projects) + '</td></tr>'
      html += '<tr><td>MEA Contribution</td><td>' + stat.contribution + '</td></tr>'
      html += '<tr><td>Total Project Cost</td><td>' + stat.project_cost + '</td></tr>'
      html += '<tr><td>Investment Leverage</td><td>' + stat.investment_leverage + '</td></tr>'
      if (Dashboard.activetab === 'efficiency') {
        html += '<tr><td>Electricity Savings</td><td>' + d3.format(',')(stat.electricity_savings_kwh) + ' kWh</td></tr>'
      }
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