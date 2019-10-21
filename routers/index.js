const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');
const Busboy = require('busboy');
const admin = require('../lib/admin');
const config = require('../config/config');

const index = Router();

index.get('/', (req, res) => {
  res.render('index', {
    version: pkg.version,
    name: pkg.name,
    env: process.env.NODE_ENV
  });
});

index.get('/update', (req, res) => {
  res.render('update', {
    version: pkg.version,
    name: pkg.name,
    env: process.env.NODE_ENV
  });
});

index.post('/update', (req, res) => {
  var tab = '', 
    fileLocation = '', 
    pass = false;

  var busboy = new Busboy({ headers: req.headers })
  busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated) => {
    if (fieldname === 'tab') {
      tab = val
    }
    if (fieldname === 'password') {
      pass = val === config.adminpass
    }
  });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype === 'text/csv') {
      var fileLocation = path.join(path.join(__dirname, '../data'), path.basename(filename))
      var w = file.pipe(fs.createWriteStream(fileLocation))
      w.on('finish', () => {
        if (pass) {
          admin.geocode(tab, fileLocation, (err, res) => {
            console.log('done')
          })
        }
      })
    }
    file.on('end', () => {

    })
  });

  busboy.on('finish', () => {
    res.writeHead(200, { 'Connection': 'close' })
    if (pass) {
      res.end("Updating.")
    } else {
      res.end("Incorrect Password.")
    }
  });
  return req.pipe(busboy)
});


module.exports = index