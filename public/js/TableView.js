var ChartView = require('./ChartView')

var TableView = ChartView.extend({
  template: $('#table-template').html(),
  events: function(){
    return _.extend({},ChartView.prototype.events,{
      'click th' : 'sortByHeader',
      'click td.grouper' : 'setGroupBy',
      "click .tochart": "toChart"
    })
  },
  render: function() {
    var self = this
    var attrs = this.model.toJSON()
    if(attrs.data) {
      attrs.data = this.prepData(attrs.data)
    }
    this.$el.html(Mustache.render(this.template, attrs, {
      title: $('#title-partial').html(),
      toolbar: $('#toolbar-partial').html()
    }))
    this.$el.find('th').each(function(idx, th){
      if(th.innerHTML === self.model.get('sort_key')) {
        $(th).addClass('sort')
      }
    })
    $(this.$el.find('thead tr')).each(function(idx){
      $(this).children(':first').addClass('first')
    })
    $('.grouper a').tooltip()
    return this
  },
  update: function(){
    this.render()
    this.resize()
  },
  prepData: function(res) {
    var table = {
      rows: [],
      columns: []
    }
    if(res.length) {
      var data = res
      var columns = _.keys(data[0])
      table.columns = columns
      _.each(data, function(row){
        var v = []
        columns.forEach(function(c) {
          v.push(row[c])
        })
        table.rows.push({
          row: v
        })
      })
    }
    return table
  },
  sortByHeader: function(e) {
    var column = $(e.target).attr('id')
    console.log(column)
    this.model.sortByKey(column)
  },
  setGroupBy: function(e){
    var groupBy = this.model.get('groupBy')
    var value = $('<div />').html($(e.target).html()).text()
    if(!this.model.get('showID')) {
      var key = _.where(this.model.get('data'), {'Name': value})[0]['ID']
    } else {
      var key = value
    }
    var m = Dashboard.filterCollection.where({name: groupBy})
    if(m.length) {
      m[0].set({name: groupBy, value: key, display: value})
    } else {
      Dashboard.filterCollection.add([
        {name: groupBy, value: key, display: value}
      ])
    }
  },
  toChart: function(){
    if(this.model.get('chart_type') === 'bar' || this.model.get('chart_type') === 'table') {
      var BarChartView = require('./BarChartView')
      var view = new BarChartView({
        model: this.model
      })
    } else if(this.model.get('chart_type') === 'line') {
      var LineChartView = require('./LineChartView')
      var view = new LineChartView({
        model: this.model
      })
    } else if(this.model.get('chart_type') === 'hbar') {
      var HorizontalBarChartView = require('./HorizontalBarChartView')
      var view = new HorizontalBarChartView({
        model: this.model
      })
    } else if(this.model.get('chart_type') === 'pie') {
      var PieChartView = require('./PieChartView')
      var view = new PieChartView({
        model: this.model
      })
    }
    this.$el.parent().html(view.render().el)
    view.update()
  }
})

module.exports = TableView