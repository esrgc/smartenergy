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
    if (this.options.y) {
      var y = this.options.y
    } else {
      var  y = this.model.get('y')
    }
    var self = this
    var table = this.$el.find('table')
    table.empty()
    var html = '<thead><tr>'
    var keys = []
    html += '<th>' + this.model.get('key') + '</th>'
    if (typeof y === 'string') {
      y = [y]
    }
    y.forEach(function(_y) {
      html += '<th>' + _y
      if (self.model.get('showUnitsInTable')) {
        html += ' (' + self.model.get('units') + ')'
      }
      html += '</th>'
      keys.push(_y)
    })
    html += '</tr></thead><tbody>'
    _.each(data, function(row, idx) {
      html += '<tr>'
      html += '<td>' + self.model.get('labelFormat')(row[self.model.get('key')]) + '</td>'
        _.each(keys, function(key) {
          html += '<td>'
          if (self.model.get('dontFormat').indexOf(key) < 0) {
            html += self.model.get('valueFormat')(row[key])
          } else {
            html += row[key]
          }
          html += '</td>'
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
    var data = this.model.sortByKey(this.model.get('data'), column)
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
    var view = Dashboard.makeChartView(this.model)
    this.$el.parent().html(view.render().el)
    view.update()
  }
})

module.exports = TableView