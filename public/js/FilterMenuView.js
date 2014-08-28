var ChartView = require('./ChartView')
  , TechnologyFilter = require('./TechnologyFilter')
  , SectorFilter = require('./SectorFilter')



var FilterMenuView = ChartView.extend({
  template: $('#filter-menu-template').html(),
  events: {

  },
  initialize: function(){
    //Dashboard.filterCollection.on('add', this.addFilter, this)
    Dashboard.filterCollection.on('remove', this.removeFilter, this)
    Dashboard.filterCollection.on('reset', this.removeFilter, this)
  },
  render: function() {
    var self = this
    this.$el.html(Mustache.render(this.template, {title: 'Project Types'}, {
      title: $('#title-partial').html()
    }))
    this.changeSummary()
    return this
  },
  update: function() {
    var self = this
    this.resize()
    self.$el.find('.technology').hide()
    self.$el.find('.vehicle-technology').hide()
    self.$el.find('.sector').hide()
    self.$el.find('.program').hide()
    $('.the-filters').empty()
    Dashboard.filterCollection.each(function(filter) {
      if (filter.get('type') === 'technology') {
        self.$el.find('.technology').show()
        self.$el.find('.technology .the-filters').append(new TechnologyFilter({model: filter}).render().el)
      } else if (filter.get('type') === 'vehicle_technology') {
        self.$el.find('.vehicle_technology').show()
        self.$el.find('.vehicle_technology .the-filters').append(new TechnologyFilter({model: filter}).render().el)
      } else if (filter.get('type') === 'charging_fueling_station_technology') {
        self.$el.find('.charging_fueling_station_technology').show()
        self.$el.find('.charging_fueling_station_technology .the-filters').append(new TechnologyFilter({model: filter}).render().el)
      } else if (filter.get('type') === 'sector') {
        self.$el.find('.sector').show()
        self.$el.find('.sector .the-filters').append(new SectorFilter({model: filter}).render().el)
      } else if (filter.get('type') === 'program_type') {
        self.$el.find('.program').show()
        self.$el.find('.program .the-filters').append(new SectorFilter({model: filter}).render().el)
      }
    })
  },
  removeFilter: function(filter) {

  },
  changeSummary: function() {
    $('.dashboard .filter-summary').html('')
    var filters = Dashboard.filterCollection.where({active: true})
  }
})

module.exports = FilterMenuView