var ChartView = require('./ChartView')

var TableView = ChartView.extend({
  template: $('#table-empty-template').html(),
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
    console.log(attrs)
    // if(attrs.data) {
    //   attrs.data = this.prepData(attrs.data)
    // }
    this.$el.html(Mustache.render(this.template, attrs, {
      title: $('#title-partial').html(),
      toolbar: $('#toolbar-partial').html()
    }))
    this.drawTable(this.model.get('data'))
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
    this.drawTable(this.model.get('data'))
    this.resize()
  },
  drawTable: function(data) {
    var self = this
    var table = this.$el.find('table')
    console.log(table)
    table.empty()
    var html = '<thead><tr>'
    var keys = []
    html += '<th>' + this.model.get('key') + '</th>'
    if (typeof this.model.get('y') === 'string') {
      keys.push(this.model.get('y'))
      html += '<th>' + this.model.get('y') + '</th>'
    } else if (typeof this.model.get('y') === 'object') {
      this.model.get('y').forEach(function(y) {
        html += '<th>' + y + '</th>'
        keys.push(y)
      })
    }
    html += '</tr></thead><tbody>'
    //var data = this.model.get('data')
    _.each(data, function(row, idx) {
      html += '<tr>'
      html += '<td>' + self.model.get('labelFormat')(row[self.model.get('key')]) + '</td>'
        _.each(keys, function(key) {
          html += '<td>' + self.model.get('valueFormat')(row[key]) + '</td>'
        })
      html += '</tr>'
    })
    html += '</tbody>'
    table.html(html)
  },
  prepData: function(res) {
    var self = this
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
    var column = $(e.target).html()
    console.log(column)
    var data = this.model.sortByKey(this.model.get('data'), column)
    console.log(data)
    this.drawTable(data)
    //this.model.set('data', data)
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