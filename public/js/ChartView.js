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
    this.colors = Dashboard.colors
    this.hoverTemplate = '{{label}}: {{value}} ' + this.model.get('units')
  },
  render: function() {
    this.$el.html(Mustache.render(this.template, this.model.toJSON(), {
      title: $('#title-partial').html()
    }))
    return this
  },
  updateChartTools: function() {
    if (this.model.get('tools')) {
      this.$el.find('.chart-tools label:first-child input').attr('checked', 'checked')
    } else {
      this.$el.find('.chart-tools').hide()
    }
  },
  changeChartTools: function(e) {
    var value = $(e.currentTarget).val()

    this.chart.options.barLabelFormat = this.model.get('valueFormat')
    this.chart.options.hoverTemplate = "{{x}}: {{y}} " + this.model.get('units')
    this.chart.options.barLabels = this.model.get('barLabels')

    if (value === 'all') {
      this.chart.options.y = this.model.get('y')
      this.colors = Dashboard.colors
    } else {
      if (typeof this.chart.options.y === 'object') {
        var idx = _.indexOf(this.chart.options.y, value)
        if (idx > -1) this.colors = [this.chart.options.colors[idx]]
      }
      var type = _.findWhere(this.model.get('tools'), {value: value}).type
      if (type) {
        if (type === 'money') {
          this.chart.options.barLabelFormat = d3.format('$.2s')
          this.chart.options.valueFormat = d3.format('$,.2f')
          this.chart.options.hoverTemplate = '{{x}}: {{y}}'
          //this.chart.options.barLabels = false
        }
      }
      this.chart.options.y = value
    }
    this.update()
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
    this.chart.setColor(this.colors)
    this.chart.update(d)
  },
  resize: function() {
    var height = this.$el.find('.chart').innerHeight()
      - this.$el.find('.title').outerHeight(true)
      - parseInt(this.$el.find('.chart').css('padding'))*2
    this.$el.find('.chart-inner').css('height', height + 'px')
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
      self.colors = colors
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
    var querystring = $.param(Dashboard.filterCollection.toJSON())
    var url = this.model.get('api') + '?csv=true&' + querystring
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
      y: this.model.get('y')
    })
    this.$el.parent().html(view.render().el)
    view.resize()
  }
})

module.exports = ChartView