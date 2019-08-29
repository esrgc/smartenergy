var csv = require('csv')

function makeCSVfromJSON(data) {
  var rows = []
  var keys = Object.keys(data[0])
  rows.push(keys)
  data.forEach(function(obj){
    var row = []
    keys.forEach(function(key){
      row.push(obj[key])
    })
    rows.push(row)
  })
  return rows
}

function returnData(req, res, data) {
  if(req.query.csv) {
    res.contentType('csv')
    var rows = makeCSVfromJSON(data)
    var result = []
    csv()
    .from.array(rows)
    .to.string(function(output){
      res.set('Content-Type', 'text/csv')
      res.set('Content-disposition', 'attachment;filename=' + req.route.path.substring(1) + '.csv')
      res.send(output)
    })
  } else {
    res.json(data)
  }
}

module.exports = returnData