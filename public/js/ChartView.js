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
      self.render()
      self.resize()
      self.update()
    })
    this.listenTo(this.model, 'change:data', this.update)
    this.listenTo(this.model, 'change:loading', this.loading)
    this.listenTo(this.model, 'remove', this.remove)
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
    this.chart.update(this.prepData(this.model.get('data')))
  },
  resize: function() {
    var height = this.$el.find('.chart').innerHeight() - this.$el.find('.title').outerHeight() - parseInt(this.$el.find('.chart').css('padding'))*2 - 2
    this.$el.find('.chart-inner').height(height)
    this.$el.find('.loader').css('line-height', height + 'px')
  },
  remove: function() {
    this.$el.parent().remove()
  },
  loading: function(e) {
    var self = this
    if (this.model.get('loading')) {
      this.$el.find('.loader').show()
      setTimeout(function() {
        if (self.model.get('loading')) {
          self.$el.find('.the-chart').hide()
        }
      }, 500)
    } else {
      this.$el.find('.loader').hide()
      this.$el.find('.the-chart').show()
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
    var querystring = $.param(Dashboard.filterCollection.toJSON())
    var url = this.model.get('api') + '?' + querystring
    window.open(url)
  }
})

module.exports = ChartView