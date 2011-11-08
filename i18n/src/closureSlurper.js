#!/usr/bin/env node
'use strict';

require.paths.push(__dirname);
var Q  = require('qq'),
    qfs  = require('q-fs'),
    converter = require('converter.js'),
    util = require('util.js'),
    localeInfo = {},
    localeIds = [],
    currencySymbols,
    goog = { provide: function() {},
             require: function() {},
             i18n: {currency: {}, pluralRules: {}} };

createFolder('../locale/').then(function() {
  var promiseA = Q.defer(),
      promiseB = Q.defer();

  qfs.read(__dirname + '/../closure/currencySymbols.js', 'b').then(function(content) {
    eval(content.toString());
    currencySymbols = goog.i18n.currency.CurrencyInfo;
    currencySymbols.__proto__ = goog.i18n.currency.CurrencyInfoTier2;

    qfs.read(__dirname + '/../closure/numberSymbols.js', 'b').then(function(content) {
      //eval script in the current context so that we get access to all the symbols
      eval(content.toString());
      for (propName in goog.i18n) {
        var localeID = util.findLocaleId(propName, 'num');
        if (localeID) {
          if (!localeInfo[localeID]) {
            localeInfo[localeID] = {};
            localeIds.push(localeID);
          }
          var convertedData = converter.convertNumberData(goog.i18n[propName], currencySymbols);
          localeInfo[localeID].NUMBER_FORMATS = convertedData;
        }
      }

      promiseA.resolve();
    });
  });


  qfs.read(__dirname + '/../closure/datetimeSymbols.js', 'b').then(function(content) {
    eval(content.toString());
    for (propName in goog.i18n) {
      var localeID = util.findLocaleId(propName, 'datetime');
      if (localeID) {
        if (!localeInfo[localeID]) {
          localeInfo[localeID] = {};
          localeIds.push(localeID);
        }
        var convertedData = converter.convertDatetimeData(goog.i18n[propName]);
        localeInfo[localeID].DATETIME_FORMATS = convertedData;
      }
    }

    promiseB.resolve();
  });

  return Q.join(promiseA.promise, promiseB.promise, noop);
}).then(function() {
  var promise = Q.defer();

  qfs.read(__dirname + '/../closure/pluralRules.js').then(function(content) {
    for(var i = 0; i < localeIds.length; i++) {
      //We don't need to care about country ID because the plural rules in more specific id are 
      //always the same as those in its language ID.
      // e.g. plural rules for en_SG is the same as those for en.
      goog.LOCALE = localeIds[i].match(/[^_]+/)[0];
      eval(content);
      var temp = goog.i18n.pluralRules.select.toString().
                     replace(/goog.i18n.pluralRules.Keyword/g, 'PLURAL_CATEGORY').replace(/\n/g, '');

      ///@@ is a crazy place holder to be replaced before writing to file
      localeInfo[localeIds[i]].pluralCat = "@@" + temp + "@@";
    }
    promise.resolve();
  });

  return promise.promise;
}).then(function() {
  localeIds.forEach(function(localeID) {
    var fallBackID = localeID.match(/[A-Za-z]+/)[0],
        localeObj = localeInfo[localeID],
        fallBackObj = localeInfo[fallBackID];

    // fallBack to language formats when country format is missing
    // e.g. if NUMBER_FORMATS of en_xyz is not present, use the NUMBER_FORMATS of en instead
    if (!localeObj.NUMBER_FORMATS) {
      localeObj.NUMBER_FORMATS = fallBackObj.NUMBER_FORMATS;
    }

    if (!localeObj.DATETIME_FORMATS) {
       localeObj.DATETIME_FORMATS = fallBackObj.DATETIME_FORMATS;
    }

    // e.g. from zh_CN to zh-CN, from en_US to en-US
    var correctedLocaleId = localeID.replace(/_/g, '-').toLowerCase();
    localeObj.id = correctedLocaleId;

    var prefix =
      'window.angular = window.angular || {};\n' +
      'angular.module = angular.module || {};\n' +
      'angular.module.NG_LOCALE = ["$provide", function($provide) {\n' +
         'var PLURAL_CATEGORY = {' +
           'ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"' +
         '};\n' +
         '$provide.value("$locale", ';

    var suffix = ');\n}];';

    var content = JSON.stringify(localeInfo[localeID]).replace(/\¤/g,'\\u00A4').
                      replace(/"@@|@@"/g, '');

    var toWrite = prefix + content + suffix;
    qfs.write(__dirname + '/../locale/' + 'angular-locale_' + correctedLocaleId + '.js', toWrite);
  });
  console.log('Generated ' + localeIds.length + ' locale files!');
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
