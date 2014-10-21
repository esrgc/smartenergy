var ChartView = Backbone.View.extend({
  template: $('#chart-template').html(),
  dataLimit: 30,
  events: {
    "click .download":  "download",
    "click .code":  "code",
    "click .totable": "toTable",
    "change .chart-tools input": 'changeChartTools'
  },
  initialize: function(options) {
    var self = this
    this.options = options || {};
    $(window).on('resize', function(){
      self.chart = false
      self.update()
    })
    this.listenTo(this.model, 'change:data', this.update)
    this.listenTo(this.model, 'change:loading', this.loading)
    this.listenTo(this.model, 'change:key', this.changeKey)
    this.listenTo(this.model, 'remove', this.remove)
    this.hoverTemplate = '{{label}}: {{value}} ' + this.model.get('units')
  },
  render: function() {
    this.$el.html(Mustache.render(this.template, this.model.toJSON(), {
      title: $('#title-partial').html()
    }))
    return this
  },
  updateChartTools: function() {
    var self = this
    if (this.model.get('tools')) {
      this.$el.find('.chart-tools input').each(function(idx) {
        if (typeof self.model.get('y') === 'string') {
          var y = [self.model.get('y')]
        } else {
          var y = self.model.get('y')
        }
        if ($(this).val().split(',').join(',') === y.join(',')) {
          $(this).attr('checked', 'checked')
        }
      })
    } else {
      this.$el.find('.chart-tools').hide()
    }
  },
  changeChartTools: function(e) {
    var value = $(e.currentTarget).val()
    this.changeChartOptionsOnKey(value)
    this.update()
  },
  changeChartOptionsOnKey: function(key) {
    var self = this
    this.chart.options.valueFormat = d3.format(',.0f')
    this.chart.options.barLabelFormat = d3.format(',.0f')
    this.chart.options.barLabels = this.model.get('barLabels')

    var colors = []
      , keys = key.split(',')
      , tool = _.findWhere(this.model.get('tools'), {value: key})

    if (tool) {
      if (tool.type) {
        if (tool.type === 'money') {
          this.chart.options.barLabelFormat = d3.format('$,.2s')
          this.chart.options.valueFormat = d3.format('$,.0f')
        }
      }
      if (tool.color) {
        colors = tool.color
      } else {
        if (keys.length < this.chart.options.y.length) {
          keys.forEach(function(key, i) {
            var idx = _.indexOf(self.chart.options.y, key)
            if (idx > -1) {
              colors.push(Dashboard.colors[idx])
            }
          })
        } else {
          colors = Dashboard.colors
        }
      }
    }

    this.chart.options.y = keys
    this.model.set('y', keys)
    this.model.set('colors', colors)
    this.model.set('barLabelFormat', this.chart.options.barLabelFormat)
    this.model.set('valueFormat', this.chart.options.valueFormat)

  },
  changeKey: function() {
    if (this.chart) this.chart.options.x = this.model.get('key')
  },
  update: function() {
    if(!this.chart) {
      this.resize()
      this.drawChart()
    }
    var d = this.prepData(this.model.get('data'))
    this.chart.setColor(this.model.get('colors'))
    this.chart.update(d)
  },
  resize: function() {
    var height = this.$el.find('.chart').innerHeight()
      - this.$el.find('.title').outerHeight(true)
    this.$el.find('.chart-inner').css('height', height)
  },
  remove: function() {
    this.$el.parent().remove()
  },
  setColors: function(data) {
    var self = this
    var colors = []
    _.each(data, function(d) {
      var x = d[self.model.get('key')]
      var filters = Dashboard.filterCollection.where({value: x})
      if (filters.length) {
        if (filters[0].get('color')) {
          colors.push(filters[0].get('color'))
        }
      }
    })
    if (colors.length) {
      self.model.set('colors', colors)
    }
  },
  loading: function(e) {
    var self = this
    if (this.model.get('loading')) {
      this.$el.find('.loader').show()
    } else {
      this.$el.find('.loader').hide()
    }
  },
  prepData: function(data) {
    return data
  },
  download: function(e) {
    var url = this.model.makeQuery(this.model.get('api'))
    url += '&csv=true'
    window.location.href = url
  },
  code: function(e) {
    var url = this.model.makeQuery()
    window.open(url)
  },
  toTable: function(){
    var TableView = require('./TableView')
    var view = new TableView({
      model: this.model,
      chart: this.chart
    })
    this.$el.parent().html(view.render().el)
    view.resize()
  }
})

module.exports = ChartView