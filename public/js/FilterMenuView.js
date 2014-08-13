var ChartView = require('./ChartView')
  , TechnologyFilter = require('./TechnologyFilter')
  , SectorFilter = require('./SectorFilter')



var FilterMenuView = ChartView.extend({
  template: $('#filter-menu-template').html(),
  events: {

  },
  initialize: function(){
    Dashboard.filterCollection.on('reset', this.render, this)
  },
  render: function() {
    var self = this
    this.$el.html(Mustache.render(this.template, {title: 'Project Types'}, {
      title: $('#title-partial').html()
    }))
    this.update()
    return this
  },
  update: function() {
    var self = this
    this.resize()
    Dashboard.filterCollection.each(function(filter) {
      if (filter.get('type') === 'technology') {
        self.$el.find('.technology').show()
        self.$el.find('.technology').append(new TechnologyFilter({model: filter}).render().el)
      } if (filter.get('type') === 'vehicle-technology') {
        self.$el.find('.vehicle-technology').show()
        self.$el.find('.vehicle-technology').append(new TechnologyFilter({model: filter}).render().el)
      } else if (filter.get('type') === 'sector') {
        self.$el.find('.sector').show()
        self.$el.find('.sector').append(new SectorFilter({model: filter}).render().el)
      } else if (filter.get('type') === 'program') {
        self.$el.find('.program').show()
        self.$el.find('.program').append(new SectorFilter({model: filter}).render().el)
      }
    })
  }
})

module.exports = FilterMenuView