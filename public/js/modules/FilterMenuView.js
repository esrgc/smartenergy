var ChartView = require('./ChartView')
  , FilterLabelView = require('./FilterLabelView')
  , TechnologyFilter = require('./TechnologyFilter')
  , templates = require('./templates')(Handlebars)  

var FilterMenuView = ChartView.extend({
  template: templates['filter-menu'],
  events: {
    'click .reset': 'resetFilters',
    'change select': 'changeDropdown'
  },
  initialize: function(){
    Dashboard.filterCollection.on('change:active', this.changeSummary, this)
    Dashboard.filterCollection.on('add', this.changeSummary, this)
    Dashboard.filterCollection.on('remove', this.changeSummary, this)
    Dashboard.filterCollection.on('reset', this.removeFilter, this)
  },
  render: function() {
    var self = this
    this.$el.html(this.template({title: 'Project Filters', toolbar: false}))
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
    self.$el.find('.charging_fueling_station_technology').hide()
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
        self.$el.find('.sector .the-filters').append(new FilterLabelView({model: filter}).render().el)
      } else if (filter.get('type') === 'program_type') {
        self.$el.find('.program').show()
        self.$el.find('.program .the-filters').append(new FilterLabelView({model: filter}).render().el)
      }
    })
    var program_names = Dashboard.filterCollection.where({type: 'program_name'})
    if (program_names.length) {
      var dropdown = this.makeDropDown('program_name', program_names)
      self.$el.find('.program').show()
      self.$el.find('.program .the-filters').append(dropdown)
    }
  },
  makeDropDown: function(type, filters) {
    var html = '<select class="form-control" id="' + type + '">'
    html += '<option value="">All</option>'
    _.each(filters, function(filter) {
      html += '<option value="' + filter.get('value') + '">' + filter.get('value') + '</option>'
    })
    html += '</select>'
    return html
  },
  changeDropdown: function(e) {
    var value = $(e.currentTarget).val()
    var type = $(e.currentTarget).attr('id')
    _.each(Dashboard.filterCollection.where({type: type}), function(f) {
      f.set('active', false, {silent: true})
    })
    var filter = Dashboard.filterCollection.findWhere({type: type, value: value})
    if (filter) {
      filter.set('active', true, {silent: true})
    }
    this.changeSummary()
    Dashboard.update()
  },
  removeFilter: function(filter) {

  },
  resetFilters: function() {
    Dashboard.mapView.reset()
    var geofilters = Dashboard.filterCollection.where({geo: true})
    Dashboard.filterCollection.remove(geofilters)
    Dashboard.filterCollection.each(function(filter) {
      if (filter.get('active')) filter.set({'active': false})
    })
    this.$el.find('select').val('')
  },
  changeSummary: function() {
    $('.dashboard .filter-summary').html('')
    var summary = '<p>'
    var filters = _.reject(Dashboard.filterCollection.where({active: true}), function(f) {
      if (f.get('type') === 'group') return true
    })
    if (filters.length == 0) {
      summary += 'All Projects'
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
      var filters = Dashboard.filterCollection.where({active: true, type: 'program_name'})
      if (filters.length) {
        var x = []
        _.each(filters, function(f) {
          x.push(f.get('value'))
        })
        if (filters.length == 1) {
          summary += ' in the ' + x.join(', ').replace('Program', '') + ' program'
        } else {

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
    summary += '</p>'
    $('.dashboard .filter-summary').html(summary)
  }
})

module.exports = FilterMenuView