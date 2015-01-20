var fs = require('fs')
  , path = require('path')
  , _ = require('lodash')
  , async = require('async')
  , turf = require('turf')
  , geocoder = require('mdimapgeocoder')
  , csv = require('csv')
  , request = require('request')
  , geojsonArea = require('geojson-area')
  , downloader = require('../lib/downloader')
  , config = require('../config/config')
  , mongo = require('../lib/mongo')
  , columns = require('../lib/columns')
  , counties = require('../lib/maryland-counties-single.json')
  , legislative = require('../lib/maryland-legislative-districts-single.json')
  , congressional = require('../lib/maryland-congressional-districts-single.json')
  , zips = require('../lib/maryland-zips-single.json')
  , cities = require('../lib/maryland-cities.json')
  , intersection_lookup = require('./intersection_lookup.json')

var Admin = function() {
  this.address_errors = []
}

Admin.prototype = {
  geocode: function(tab, fileLocation, next) {
    var self = this
    console.log(fileLocation)
    var input = fs.readFileSync(fileLocation, {encoding: 'utf8'})
    csv.parse(input, {columns: true}, function(err, data) {
      async.map(data, self.geocodeRow.bind(self), function(err, data) {
        console.log('done geocoding.')
        data = self.findRegions(data)
        csv.stringify(self.address_errors, {header: true}, function(err, data) {
          fs.writeFileSync(path.join(__dirname, '../data') + '/' + tab + '_address_errors.csv', data)
        })

        csv.stringify(data, {header: true}, function(err, data) {
          fs.writeFileSync(path.join(__dirname, '../data') + '/' + tab + '_geocoded.csv', data)
        })

        data = self.cleanUp(data, tab)
        // self.updateSocrata(data, tab, function(err) {
        //   if (err) console.log('updateSocrata err', err)
        //   else console.log('updateSocratacomplete.')
        // })
        data = self.findRegionalProjects(data)
        fs.writeFileSync(__dirname + '/' + 'intersection_lookup.json', JSON.stringify(intersection_lookup))
        self.updateMongo(data, tab, function(err) {
          if (err) console.log('updateMongo err', err)
          else console.log('updateMongo complete.')
        })
        //console.log('done')
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
  makePoint: function(candidates) {
    return candidates[0].location.y + ',' + candidates[0].location.x
  },
  geocodeRow: function(row, next) {
    var self = this
    if (row.point === "" || typeof row.point == 'undefined') {
      var address = self.makeAddress(row)
      var addressLine = self.makeAddressLine(row)
      var isStreetAddress = (typeof row.Address1 != 'undefined' && row.Address1 !== "")
      if (isStreetAddress && (row.Sector === 'Residential' || row.Sector === 'Agriculture')) {
        geocoder.search({ZIP: row.Zip.substring(0, 5)}, function(row, err, res) {
          if (res.candidates.length) {
            row.point = self.makePoint(res.candidates)
          } else {
            row.point = ""
          }
          next(null, row)
        }.bind(this, row))
      } else {
        //First try Address object
        geocoder.search(address, {outFields: ['ZIP', 'City']}, function(row, err, res) {
          if (res.candidates.length) {
            row.point = self.makePoint(res.candidates)
            if (res.candidates[0].attributes.ZIP) {
              row.Zip = res.candidates[0].attributes.ZIP
            }
            if (res.candidates[0].attributes.City) {
              row.City = res.candidates[0].attributes.City
            }
            next(null, row)
          } else {
            //Try SingleLine
            geocoder.search(addressLine, {outFields: ['ZIP', 'City']}, function(row, err, res) {
              if (res.candidates.length) {
                row.point = self.makePoint(res.candidates)
                if (res.candidates[0].attributes.ZIP) {
                  row.Zip = res.candidates[0].attributes.ZIP
                }
                if (res.candidates[0].attributes.City) {
                  row.City = res.candidates[0].attributes.City
                }
              } else {
                self.address_errors.push(row)
                row.point = ""
              }
              next(null, row)
            }.bind(self, row))
          }
        }.bind(self, row))
      }
    } else {
      next(null, row)
    }
  },
  cleanUp: function (data, tab) {
    data = data.map(function(row) {
      var new_row = {
        point: row.point
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
  findRegions: function(data) {
    var self = this
    data.forEach(function(row) {
      if (typeof row.point != 'undefined' && row.point != '') {
        var point = row.point.split(",")
        if (point.length == 2) {
          if (!row.county) row.county = self.findPointInRegion(point, counties)
          if (!row.legislative) row.legislative = self.findPointInRegion(point, legislative)
          if (!row.congressional) row.congressional = self.findPointInRegion(point, congressional)
        }
      }
      if (typeof row.Zip !== 'undefined' && row.Zip.length) {
        row.zipcode = row.Zip.substring(0, 5)
      } else {
        row.zipcode = row.Zip
      }
    })
    return data
  },
  findRegionalProjects: function(data) {
    var self = this
    var newrows = []
    data.forEach(function(row) {
      row.regional = false
      var region_key = 'recipient_region_if_applicable'
      if (typeof row[region_key] != 'undefined' && row[region_key] != '') {
        var region = self.findRecipientRegion(row[region_key])
        console.log(region)
        if (region) {
          var intersections = []
          intersections = self.findRegionInRegion(region, zips, 'zipcode')
          if (intersections.length > 0) data = data.concat(self.makeRegionalRows(row, intersections, 'zipcode'))
          intersections = self.findRegionInRegion(region, counties, 'county')
          if (intersections.length > 0) data = data.concat(self.makeRegionalRows(row, intersections, 'county'))
          intersections = self.findRegionInRegion(region, legislative, 'legislative')
          if (intersections.length > 0) data = data.concat(self.makeRegionalRows(row, intersections, 'legislative'))
          intersections = self.findRegionInRegion(region, congressional, 'congressional')
          if (intersections.length > 0) data = data.concat(self.makeRegionalRows(row, intersections, 'congressional'))
        }
      }
    })
    return data
  },
  makeRegionalRows: function(row, intersections, column) {
    var newrows = []
    intersections.forEach(function(intersection, idx) {
      var newrow = _.clone(row)
      newrow.regional = column
      newrow[column] = intersection.name
      newrow.id = row.id + '_R' + (idx+1)
      newrow.mea_award = row.mea_award * intersection.p
      newrow.other_agency_dollars = row.other_agency_dollars * intersection.p
      newrow.leveraged_utility_funds = row.leveraged_utility_funds * intersection.p
      newrow.total_project_cost = row.total_project_cost * intersection.p
      newrows.push(newrow)
    })
    return newrows
  },
  findRecipientRegion: function(region_name) {
    if (region_name.indexOf('County') >= 0) {
      var layer = counties
       , region_type = 'county'
      region_name = region_name.replace(' County', '')
    } else {
      var layer = cities
        , region_type = 'city'
      if (region_name.indexOf('Baltimore') < 0) {
        region_name = region_name.replace(' City', '')
        region_name = region_name.replace(' Town', '')
      }
      region_name = region_name.toUpperCase()
    }
    var region = _.filter(layer.features, function(feature) {
      var normalized = feature.properties.name.replace(' CITY', '')
      normalized = normalized.replace(' TOWN', '')
      normalized = normalized.replace(' County', '')
      return normalized === region_name
    })
    if (region.length > 0) {
      region = region[0]
      region.properties.region_type = region_type
      return region
    } else {
      return false
    }
  },
  findRegionInRegion: function(region, layer, layer_type) {
    var look_up_name = region.properties.name + '_' + region.properties.region_type
    if (intersection_lookup[look_up_name] && intersection_lookup[look_up_name][layer_type]) {
      console.log('found', look_up_name, 'in lookup.')
      return intersection_lookup[look_up_name][layer_type]
    } else {
      console.log('finding', layer_type, 'intersections for', look_up_name, '...')
      var region_area = geojsonArea.geometry(region.geometry)
      var intersections = []
      for (var x in layer.features) {
        var feature = layer.features[x]
        var intersection = turf.intersect(region.geometry, feature.geometry)
        if (intersection) {
          var area = geojsonArea.geometry(intersection.geometry)
          var p = (area / region_area)
          if (p > .02) {
            intersections.push({
              p: p,
              name: feature.properties.name
            })
          }
        }
      }
      if (!intersection_lookup[look_up_name]) intersection_lookup[look_up_name] = {}
      intersection_lookup[look_up_name][layer_type] = intersections
      return intersections
    }
  },
  findPointInRegion: function(point, layer) {
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
    mongo.db.collection(tab).insert(data, {w: 1}, function(err, records){
      console.log(records.length + ' inserted.')
      next(err)
    })
    // async.each(data, function(doc, next) {
    //   doc.state = 'Maryland'
    //   mongo.db.collection(tab).update(
    //     {id: doc.id},
    //     doc,
    //     {upsert: true},
    //     function(err, count, status) {
    //       next(err)
    //     }
    //   )
    // }, function(err) {
    //   next(err)
    // })
  }
}

module.exports = new Admin()