var ChartView = require('./ChartView')
  , TechnologyFilter = require('./TechnologyFilter')
  , SectorFilter = require('./SectorFilter')

var FilterMenuView = ChartView.extend({
  template: $('#filter-menu-template').html(),
  events: {

  },
  initialize: function(){
    Dashboard.filterCollection.on('change:active', this.changeSummary, this)
    Dashboard.filterCollection.on('add', this.changeSummary, this)
    Dashboard.filterCollection.on('remove', this.changeSummary, this)
    Dashboard.filterCollection.on('reset', this.removeFilter, this)
  },
  render: function() {
    var self = this
    this.$el.html(Mustache.render(this.template, {title: 'Project Filters', toolbar: false}, {
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
    var summary = ''
    var filters = _.reject(Dashboard.filterCollection.where({active: true}), function(f) {
      if (f.get('type') === 'group') return true
    })
    if (filters.length == 0) {
      summary = 'All Projects'
    } else {
      var filters = Dashboard.filterCollection.where({active: true, type: 'technology'})
      if (filters.length) {
        var x = []
        _.each(filters, function(f) {
          x.push(f.get('value'))
        })
        if (filters.length == 1) {
          summary += x[0] + ' projects'
        } else {
          summary += _.initial(x).join(', ')
            + ' and ' + _.last(x)
            + ' projects'
        }
      } else {
        summary += 'All projects'
      }
      var filters = Dashboard.filterCollection.where({active: true, geo: true})
      console.log(filters.length)
      if (filters.length) {
        var x = []
        _.each(filters, function(f) {
          x.push(f.get('value'))
        })
        var type = filters[0].get('type')
        var geo_lookup = {
          'county': 'County',
          'legislative': 'Legislative District',
          'congressional': 'Congressional District',
          'zipcode': 'Zip Code',
        }
        summary += ' in '
        if (filters.length === 1 ) {
          if (type === 'county') {
            summary += x[0] + ' ' + geo_lookup[type]
          } else {
            summary += geo_lookup[type] + ' ' + x[0]
          }
        } else {
          var list = '' + _.initial(x).join(', ')
            + ' and ' + _.last(x)
          if (type === 'county') {
            summary += list + ' Counties'
          } else {
            summary += geo_lookup[type] + 's ' + list
          }
        }
      }
      var filters = Dashboard.filterCollection.where({active: true, type: 'program_type'})
      if (filters.length) {
        var x = []
        _.each(filters, function(f) {
          x.push(f.get('value'))
        })
        if (filters.length == 1) {
          summary += ' funded by ' + x.join(', ')
        } else {
          summary += ' funded by '
            + _.initial(x).join(', ')
            + ' and ' + _.last(x)
        }
      }
      var filters = Dashboard.filterCollection.where({active: true, type: 'sector'})
      if (filters.length) {
        var x = []
        _.each(filters, function(f) {
          x.push(f.get('value'))
        })
        if (filters.length == 1) {
          summary += ' in the ' + x[0] + ' sector'
        } else {
          summary += ' in '
            + _.initial(x).join(', ')
            + ' and ' + _.last(x)
            + ' sectors'
        }
      }
    }
    $('.dashboard .filter-summary').html(summary)
  }
})

module.exports = FilterMenuView