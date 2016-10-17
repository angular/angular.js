'use strict';

var fs = require('fs');
var zlib = require('zlib');
var extractValues = require('./extractValues').extractValues;
var generateCode = require('./generateCode').generateCode;
// ID_Start and ID_Continue
var propertiesToExtract = {'IDS': 'Y', 'IDC': 'Y'};

function main() {
  extractValues(
    fs.createReadStream('./ucd/src/ucd.all.flat.xml.gz').pipe(zlib.createGunzip()),
    propertiesToExtract,
    writeFile);

  function writeFile(validRanges) {
    var code = generateCode(validRanges);
    try {
      fs.lstatSync('../src/ngParseExt');
    } catch (e) {
      fs.mkdirSync('../src/ngParseExt');
    }
    fs.writeFile('../src/ngParseExt/ucd.js', code);
  }
}

main();
