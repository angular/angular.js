#!/usr/bin/env node

require.paths.push(__dirname);
var http = require('http'),
    Q  = require('qq'),
    qfs  = require('q-fs'),
    converter = require('converter.js'),
    localeInfo = {},
    localeIDs = [],
    util = require('util.js');
    goog = { provide: function() {},
             require: function() {},
             i18n: {} };

createFolder('../../localeInfo').then(function() {
  var promiseA = Q.defer();
  var promiseB = Q.defer();

  qfs.read(__dirname + '/closureFiles/numberformatsymbols.js', 'b').then(function(content) {
    //eval script in the current context so that we get access to all the symbols
    eval(content.toString());
    for (propName in goog.i18n) {
      var localeID = util.findLocaleID(propName, 'num');
      if (localeID) {
        if (!localeInfo[localeID]) {
          localeInfo[localeID] = {};
          localeIDs.push(localeID);
        }
        var convertedData = converter.convertNumberData(goog.i18n[propName]);
        localeInfo[localeID].NUMBER_FORMATS = convertedData;

        promiseA.resolve();
      }
    }
  });

  qfs.read(__dirname + '/closureFiles/datetimesymbols.js', 'b').then(function(content) {
      //eval script in the current context so that we get access to all the symbols
    eval(content.toString());
    for (propName in goog.i18n) {
      var localeID = util.findLocaleID(propName, 'datetime');
      if (localeID) {
        if (!localeInfo[localeID]) {
          localeInfo[localeID] = {};
          localeIDs.push(localeID);
        }
        var convertedData = converter.convertDatetimeData(goog.i18n[propName]);
        localeInfo[localeID].DATETIME_FORMATS = convertedData;

        promiseB.resolve();
      }
    }
  });
  return Q.join(promiseA.promise, promiseB.promise, noop);
}).then(function() {
  localeIDs.forEach(function(localeID) {
    var fallBackID = localeID.match(/[A-Za-z]+/)[0],
        localeObj = localeInfo[localeID],
        fallBackObj = localeInfo[fallBackID];

    // fallBack to formats for region when more specific format is missing
    // e.g. if NUMBER_FORMATS of en_xyz is not present, use the NUMBER_FORMATS of en instead
    if (!localeObj.NUMBER_FORMATS) {
      localeObj.NUMBER_FORMATS = fallBackObj.NUMBER_FORMATS;
    }

    if (!localeObj.DATETIME_FORMATS) {
       localeObj.DATETIME_FORMATS = fallBackObj.DATETIME_FORMATS;
    }

    // e.g. from zh_CN to zh-CN, from en_US to en-US
    var correctedLocaleId = localeID.replace('_', '-').toLowerCase();

    var prefix = 'angular.service("$locale", function() {\nreturn ',
        content = JSON.stringify(localeInfo[localeID]).replace(/\¤/g,'\\u00A4'),
        suffix;

    if (fallBackID !== localeID && util.equals(localeObj, fallBackObj)) {
      console.log(localeID, ' === ', fallBackID);
      suffix = ';\n}, {$locale: \'' + correctedLocaleId +'\', $regLocale:\' ' + fallBackID + '\'});';
    } else {
      suffix = ';\n}, {$locale: \'' + correctedLocaleId +'\'});';
    }

    toWrite = prefix + content + suffix;

    qfs.write(__dirname + '/../../localeInfo/' + 'angular_' + correctedLocaleId + '.js', toWrite);
  });
  console.log(localeIDs.length, ' locales are generated and stored!');
}).end();

function noop() {};

/**
* Make a folder under current directory.
* @param folder {string} name of the folder to be made
*/
function createFolder(folder) {
  return qfs.isDirectory(__dirname + '/' + folder).then(function(isDir) {
    if (!isDir) return qfs.makeDirectory(__dirname + '/' + folder);
  });
}
