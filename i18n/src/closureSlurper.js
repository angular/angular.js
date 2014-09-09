#!/usr/bin/env node
'use strict';

var Q  = require('q'),
    qfs  = require('q-io/fs'),
    converter = require('./converter.js'),
    util = require('./util.js'),
    closureI18nExtractor = require('./closureI18nExtractor.js'),
    localeInfo = {},
    currencySymbols,
    goog = { provide: function() {},
             require: function() {},
             i18n: {currency: {}, pluralRules: {}} };


var NG_LOCALE_DIR = '../src/ngLocale/';


function readSymbols() {
  console.log("Processing currency and number symbols ...");
  var numericStagePromise = qfs.read(__dirname + '/../closure/currencySymbols.js', 'b')
    .then(function(content) {
      var currencySymbols = closureI18nExtractor.extractCurrencySymbols(content);
      return qfs.read(__dirname + '/../closure/numberSymbols.js', 'b').then(function(content) {
          var numberSymbols = content;
          return qfs.read(__dirname + '/../closure/numberSymbolsExt.js', 'b')
            .then(function(content) {
              numberSymbols += content;
              return closureI18nExtractor.extractNumberSymbols(numberSymbols, localeInfo, currencySymbols);
            });
        });
      });

  console.log("Processing datetime symbols ...");
  var datetimeStagePromise = qfs.read(__dirname + '/../closure/datetimeSymbols.js', 'b')
      .then(function(content) {
        closureI18nExtractor.extractDateTimeSymbols(content, localeInfo);
        return qfs.read(__dirname + '/../closure/datetimeSymbolsExt.js', 'b').then(function(content) {
            closureI18nExtractor.extractDateTimeSymbols(content, localeInfo);
        });
    });

    return Q.all([numericStagePromise, datetimeStagePromise]);
}

function extractPlurals() {
  console.log('Extracting Plurals ...');
  return qfs.read(__dirname + '/../closure/pluralRules.js').then(function(content) {
    closureI18nExtractor.pluralExtractor(content, localeInfo);
  });
}

function writeLocaleFiles() {
  console.log('Final stage: Writing angular locale files to directory: %j', NG_LOCALE_DIR);
  var result = Q.defer();
  var localeIds = Object.keys(localeInfo);
  var num_files = 0;

  console.log('Generated %j locale files.', localeIds.length);
  loop();
  return result.promise;

  // Need to use a loop and not write the files in parallel,
  // as otherwise we will get the error EMFILE, which means
  // we have too many open files.
  function loop() {
    var nextPromise;
    if (localeIds.length) {
      nextPromise = process(localeIds.pop()) || Q.when();
      nextPromise.then(loop, result.reject);
    } else {
      result.resolve(num_files);
    }
  }

  function process(localeID) {
    var content = closureI18nExtractor.outputLocale(localeInfo, localeID);
    if (!content) return;
    var correctedLocaleId = closureI18nExtractor.correctedLocaleId(localeID);
    var filename = NG_LOCALE_DIR + 'angular-locale_' + correctedLocaleId + '.js'
    console.log('Writing ' + filename);
    return qfs.write(filename, content)
        .then(function () {
          console.log('Wrote ' + filename);
          ++num_files;
        });
  }

}

/**
* Make a folder under current directory.
* @param folder {string} name of the folder to be made
*/
function createFolder(folder) {
  return qfs.isDirectory(folder).then(function(isDir) {
    if (!isDir) return qfs.makeDirectory(folder).then(function() {
        console.log('Created directory %j', folder); });
  });
}

createFolder(NG_LOCALE_DIR)
  .then(readSymbols)
  .then(extractPlurals)
  .then(writeLocaleFiles)
  .done(function(num_files) { console.log("Wrote %j files.\nAll Done!", num_files); });
