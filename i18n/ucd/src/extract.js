'use strict';

var fs = require('fs');
var zlib = require('zlib');
var extractValues = require('./extractValues').extractValues;
var generateCode = require('./generateCode').generateCode;
// ID_Start and ID_Continue
var propertiesToExtract = {'IDS': 'Y', 'IDC': 'Y'};

function main() {
  extractValues(
    fs.createReadStream(__dirname + '/ucd.all.flat.xml.gz').pipe(zlib.createGunzip()),
    propertiesToExtract,
    writeFile);

  function writeFile(validRanges) {
    var code = generateCode(validRanges);
    try {
      fs.lstatSync(__dirname + '/../../../src/ngParseExt');
    } catch (e) {
      fs.mkdirSync(__dirname + '/../../../src/ngParseExt');
    }
    fs.writeFile(__dirname + '/../../../src/ngParseExt/ucd.js', code);
  }
}

main();
