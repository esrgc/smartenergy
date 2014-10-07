var request = require('request')

var root = 'http://localhost:3011/api/'
var tab = '?tab=renewableenergy'

testAPI('getSector')
testAPI('getTechnology')
testAPI('getProgramName')
testAPI('getContribution')
testAPI('getReductionOverTime')
testAPI('getStats')
testAPI('getPoints')

function testAPI(path) {
  console.time(path)
  request.get(root + path + tab, function (error, response, body) {
    console.timeEnd(path)
    if (!error && response.statusCode == 200) {
      console.log('success')
    } else {
      console.log(error)
      console.log(response.statusCode)
    }
  })
}