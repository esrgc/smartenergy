var Backbone = require('backbone')
  , ChartView = require('./ChartView')
Backbone.$ = $

Date.prototype.toDateInputValue = function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
}

var FilterMenuView = ChartView.extend({
  template: $('#filter-template').html(),
  events: {
    'click button[type="submit"]': 'submitForm',
    'click button.clear': 'clear'
  },
  initialize: function() {
    Dashboard.filterCollection.on('remove', this.render, this)
    Dashboard.filterCollection.on('add', this.render, this)
  },
  render: function() {
    var self = this
    var attrs = {}
    attrs.title = 'Filters'
    this.$el.html(Mustache.render(this.template, attrs, {
      title: $('#title-partial').html()
    }))
    var today = new Date()
    this.$el.find('input[name="endDate"]').val(today.toDateInputValue())
    today.setDate(today.getDate()-30);
    this.$el.find('input[name="startDate"]').val(today.toDateInputValue())
    return this
  },
  clear: function(e) {
    e.preventDefault()
  },
  getAttributes: function() {
    var self = this
    self.$el.find('.filter').each(function(idx, filterel){
      var inputs = $(filterel).find(':input')
      if(inputs.length) {
        var value = $(filterel).find(':checkbox:checked').map(function() {
          return this.value
        }).get().join(',')
        if(!value) {
          value = $(inputs).val()
        }
        if(value !== 'All') {
          var name = $(inputs).get(0).name
            , filters = Dashboard.filterCollection.where({'name': name})
            , filter = false
          if(filters.length){
            filters[0].set('value', value)
            filters[0].set('display', value)
          } else {
            Dashboard.filterCollection.add({
              name: name,
              value: value
            })
          }
        }
      }
    })
  },
  submitForm: function(e){
    e.preventDefault()
    this.getAttributes()
  }
})

module.exports = FilterMenuView