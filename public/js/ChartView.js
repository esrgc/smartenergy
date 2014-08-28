var ChartView = Backbone.View.extend({
  template: $('#chart-template').html(),
  events: {
    "click .download":  "download",
    "click .code":  "code"
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
    this.listenTo(this.model, 'remove', this.remove)
    this.colors = Dashboard.colors
  },
  render: function() {
    this.$el.html(Mustache.render(this.template, this.model.toJSON(), {
      title: $('#title-partial').html()
    }))
    return this
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
    var height = this.$el.find('.chart').innerHeight() - this.$el.find('.title').outerHeight(true) - parseInt(this.$el.find('.chart').css('padding'))*2 - 2
    this.$el.find('.chart-inner').height(height)
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
  prepData: function(res) {
    return res
  },
  download: function(e) {
    var querystring = $.param(Dashboard.filterCollection.toJSON())
    var url = this.model.get('api') + '?csv=true&' + querystring
    window.location.href = url
  },
  code: function(e) {
    var url = this.model.makeQuery()
    window.open(url)
  }
})

module.exports = ChartView