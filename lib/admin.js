var fs = require('fs')
  , path = require('path')
  , _ = require('lodash')
  , async = require('async')
  , turf = require('turf')
  , geocoder = require('mdimapgeocoder')
  , csv = require('csv')
  , request = require('request')
  , downloader = require('../lib/downloader')
  , config = require('../config/config')
  , mongo = require('../lib/mongo')
  , columns = require('../lib/columns')
  , counties = require('../data/maryland-counties-single.json')
  , legislative = require('../data/maryland-legislative-districts-single.json')
  , congressional = require('../data/maryland-congressional-districts-single.json')

var Admin = function() {
  this.address_errors = []
}

Admin.prototype = {
  geocode: function(tab, fileLocation, next) {
    var self = this
    var input = fs.readFileSync(fileLocation, {encoding: 'utf8'})
    console.log(fileLocation, input)
    csv.parse(input, {columns: true}, function(err, data){
      console.log(err, data)
      async.map(data, self.geocodeRow.bind(self), function(err, data) {
        console.log('done geocoding.')
        data = data.map(self.findRegions.bind(self))
        csv.stringify(self.address_errors, {header: true}, function(err, data) {
          fs.writeFileSync(path.join(__dirname, '../data') + '/' + tab + '_address_errors.csv', data)
        })

        csv.stringify(data, {header: true}, function(err, data) {
          fs.writeFileSync(path.join(__dirname, '../data') + '/' + tab + '_geocoded.csv', data)
        })

        data = self.cleanUp(data, tab)
        self.updateSocrata(data, tab, function(err) {
          if (err) console.log('updateSocrata err', err)
          else console.log('updateSocratacomplete.')
        })
        self.updateMongo(data, tab, function(err) {
          if (err) console.log('updateMongo err', err)
          else console.log('updateMongo complete.')
        })
        fs.writeFileSync(path.join(__dirname, '../data') + '/' + tab + '_formatted.json', JSON.stringify(data))
        next(err)
      })
    })
  },
  makeAddress: function(row) {
    var address = {}
    if (typeof row.Address1 !== 'undefined' && row.Address1 !== '') {
      address.Street = row.Address1
    }
    if (typeof row.City !== 'undefined' && row.City !== '') {
      address.City = row.City
    }
    if (typeof row.Zip !== 'undefined' && row.Zip.length) {
      address.ZIP = row.Zip.substring(0, 5)
    }
    return address
  },
  makeAddressLine: function(row) {
    var address = ''
    if (typeof row.Address1 !== 'undefined' && row.Address1 !== '') {
      address += row.Address1
      if (typeof row.City !== 'undefined' && row.City !== '') {
        address += ', ' + row.City
      }
      if (typeof row.Zip !== 'undefined' && row.Zip.length) {
        address += ' ' + row.Zip.substring(0, 5)
      }
    } else {
      if (typeof row.City !== 'undefined' && row.City !== '') {
        address = row.City
      } else {
        if (typeof row.Zip !== 'undefined' && row.Zip.length) {
          address = row.Zip.substring(0, 5)
        }
      }
    }
    return address
  },
  setDisplayPoint: function(row, next) {
    var self = this
    var isStreetAddress = (typeof row.Address1 != 'undefined' && row.Address1 !== "")
    if (isStreetAddress && (row.Sector === 'Residential' || row.Sector === 'Agriculture')) {
      geocoder.search({ZIP: row.Zip.substring(0, 5)}, function(row, err, res) {
        if (res.candidates.length) {
          row.display_point = res.candidates[0].location.y + ',' + res.candidates[0].location.x
        } else {
          row.display_point = ""
        }
        next(null, row)
      }.bind(this, row))
    } else {
      row.display_point = row.point
      next(null, row)
    }
  },
  geocodeRow: function(row, next) {
    var self = this
    if (row.point === "" || typeof row.point == 'undefined') {
      var address = self.makeAddress(row)
      var addressLine = self.makeAddressLine(row)

      //First try Address object
      geocoder.search(address, {outFields: ['ZIP', 'City']}, function(row, err, res) {
        if (res.candidates.length) {
          console.log(row.ID, 'geocoded 1.')
          row.point = res.candidates[0].location.y + ',' + res.candidates[0].location.x
          if (res.candidates[0].attributes.ZIP) {
            row.Zip = res.candidates[0].attributes.ZIP
          }
          if (res.candidates[0].attributes.City) {
            row.City = res.candidates[0].attributes.City
          }
          self.setDisplayPoint(row, next)
        } else {
          //Try SingleLine
          console.log(row.ID, 'missed 1.')
          geocoder.search(addressLine, {outFields: ['ZIP', 'City']}, function(row, err, res) {
            if (res.candidates.length) {
              console.log(row.ID, 'geocoded 2.')
              row.point = res.candidates[0].location.y + ',' + res.candidates[0].location.x
              if (res.candidates[0].attributes.ZIP) {
                row.Zip = res.candidates[0].attributes.ZIP
              }
              if (res.candidates[0].attributes.City) {
                row.City = res.candidates[0].attributes.City
              }
            } else {
              console.log(row.ID, 'missed 2.')
              console.log(addressLine, 'not found')
              self.address_errors.push(row)
              row.point = ""
            }
            self.setDisplayPoint(row, next)
          }.bind(self, row))
        }
      }.bind(self, row))
    } else {
      next(null, row)
    }
  },
  cleanUp: function (data, tab) {
    data = data.map(function(row) {
      var new_row = {
        point: row.display_point
      }
      columns[tab].forEach(function(col) {
        if (row[col.name] !== undefined && col.name !== 'point') {
          var value = row[col.name]
          if (col.dataTypeName === 'money' || col.dataTypeName === 'number') {
            value =  value ? parseFloat(value.replace(/,/g, "").replace('$', '')) : 0
            if (isNaN(value)) value = 0
          } else if (col.dataTypeName === 'calendar_date') {
            value = new Date(value)
          }
          //don't show total project cost as zero
          if (col.fieldName == 'total_project_cost' && value == 0) {
            value = ''
          }
          new_row[col.fieldName] = value
        }
      })
      return new_row
    })
    return data
  },
  findRegions: function(row) {
    if (typeof row.point != 'undefined' && row.point != '') {
      var point = row.point.split(",")
      if (point.length == 2) {
        if (!row.county) row.county = this.findRegion(point, counties)
        if (!row.legislative) row.legislative = this.findRegion(point, legislative)
        if (!row.congressional) row.congressional = this.findRegion(point, congressional)
      }
    }
    if (typeof row.Zip !== 'undefined' && row.Zip.length) {
      row.zipcode = row.Zip.substring(0, 5)
    } else {
      row.zipcode = row.Zip
    }
    return row
  },
  findRegion: function(point, layer) {
    var name = ''
    var x = +point[1]
      , y = +point[0]
    var pt = turf.point(x, y)
    for (var x in layer.features) {
      var feature = layer.features[x]
      var poly = turf.polygon(feature.geometry.coordinates)
      var isInside = turf.inside(pt, poly)
      if (isInside) {
        name = feature.properties.name
        return name
      }
    }
    return name
  },
  updateSocrata: function(data, tab, next) {
    var opts = {
      url: 'https://data.maryland.gov/resource/' + config.socrata.uids[tab] + '.json',
      method: 'POST',
      json: data,
      headers: {
        'Authorization': 'Basic ' + new Buffer(config.socrata.user + ':' + config.socrata.password).toString('base64'),
        'Content-Type': 'application/json',
        'X-App-Token': config.socrata.apptoken
      }
    }
    request.post(opts,
      function (err, response, body) {
        if (!err && response.statusCode == 200) {
          console.log(body)
        } else {
          console.log(err)
        }
        next(err)
      }
    )
  },
  updateMongo: function(data, tab, next) {
    async.each(data, function(doc, next) {
      doc.state = 'Maryland'
      mongo.db.collection(tab).update(
        {id: doc.id},
        doc,
        {upsert: true},
        function(err, count, status) {
          next(err)
        }
      )
    }, function(err) {
      next(err)
    })
  }
}

module.exports = new Admin()