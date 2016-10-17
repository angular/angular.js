'use strict';
/**
 * Extract values from a stream.
 */

exports.extractValues = extractValues;

var sax = require('sax/lib/sax');
var saxStrict = true;
var saxOptions = {};
var validXMLTagNames = { char: 'Y', reserved: 'Y', surrogate: 'Y', noncharacter: 'Y'};

function extractValues(stream, propertiesToExtract, callback) {
  var saxStream = sax.createStream(saxStrict, saxOptions);
  var firstValid = {};
  var lastValid = {};
  var keys = Object.keys(propertiesToExtract);
  var keyValues = keys.map(function(k) { return propertiesToExtract[k]; });
  var validRanges = {};

  for (var i in keys) {
    validRanges[keys[i] + '_' + keyValues[i]] = [];
  }
  saxStream.onopentag = onOpenTag;
  stream
    .pipe(saxStream)
    .on('end', doCallback);

  function onOpenTag(node) {
    var property;
    if (validXMLTagNames[node.name]) {
      for (var i in keys) {
        property = keyValues[i];
        if (node.attributes[keys[i]] === property) validProperty(keys[i] + '_' + property, node);
        else invalidProperty(keys[i] + '_' + property);
      }
    }
  }

  function validProperty(property, node) {
    if (!firstValid[property]) firstValid[property] =
        node.attributes.cp || node.attributes['first-cp'];
    lastValid[property] = node.attributes.cp || node.attributes['last-cp'];
  }

  function invalidProperty(property) {
    if (!firstValid[property]) return;
    validRanges[property].push([firstValid[property], lastValid[property]]);
    firstValid[property] = null;
  }

  function doCallback() {
    for (var i in keys) {
      var property = keys[i] + '_' + keyValues[i];
      invalidProperty(property);
    }
    callback(validRanges);
  }
}
