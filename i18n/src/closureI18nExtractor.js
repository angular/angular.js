'use strict';

var converter = require('./converter.js');

exports.extractNumberSymbols = extractNumberSymbols;
exports.extractCurrencySymbols = extractCurrencySymbols;
exports.extractDateTimeSymbols = extractDateTimeSymbols;
exports.pluralExtractor = pluralExtractor;
exports.outputLocale = outputLocale;
exports.correctedLocaleId = correctedLocaleId;
exports.findLocaleId = findLocaleId;
exports.serializeContent = serializeContent;

var goog = { provide: function() {},
  require: function() {},
  i18n: {currency: {}, pluralRules: {}} };

function findLocaleId(str, type) {
  if (type === 'num') {
    return (str.match(/^NumberFormatSymbols_(.+)$/) || [])[1];
  }

  if (type != 'datetime') { throw new Error('unknown type in findLocaleId: ' + type); }

  return (str.match(/^DateTimeSymbols_(.+)$/) || [])[1];
}


function getInfoForLocale(localeInfo, localeID) {
  if (!localeInfo[localeID]) {
    localeInfo[localeID] = {};
    //localeIds.push(localeID);
  }
  return localeInfo[localeID];
}

function extractNumberSymbols(content, localeInfo, currencySymbols) {
  //eval script in the current context so that we get access to all the symbols
  eval(content.toString());
  for (var propName in goog.i18n) {
    var localeID = findLocaleId(propName, 'num');
    if (localeID) {
      var info = getInfoForLocale(localeInfo, localeID);
      info.NUMBER_FORMATS =
          converter.convertNumberData(goog.i18n[propName], currencySymbols);
    }
  }
}

function extractCurrencySymbols(content) {
  //eval script in the current context so that we get access to all the symbols
  eval(content.toString());
  var currencySymbols = goog.i18n.currency.CurrencyInfo;
  currencySymbols.__proto__ = goog.i18n.currency.CurrencyInfoTier2;

  return currencySymbols;
}

function extractDateTimeSymbols(content, localeInfo) {
  //eval script in the current context so that we get access to all the symbols
  eval(content.toString());
  for (var propName in goog.i18n) {
    var localeID = findLocaleId(propName, 'datetime');
    if (localeID) {
      var info = getInfoForLocale(localeInfo, localeID);
      localeInfo[localeID].DATETIME_FORMATS =
          converter.convertDatetimeData(goog.i18n[propName]);
    }
  }
}

function pluralExtractor(content, localeInfo) {
  var contentText = content.toString();
  var localeIds = Object.keys(localeInfo);
  for (var i = 0; i < localeIds.length; i++) {
    //We don't need to care about country ID because the plural rules in more specific id are
    //always the same as those in its language ID.
    // e.g. plural rules for en_SG is the same as those for en.
    goog.LOCALE = localeIds[i].match(/[^_]+/)[0];
    try {
      eval(contentText);
    } catch(e) {
      console.log("Error in eval(contentText): " + e.stack);
    }
    if (!goog.i18n.pluralRules.select) {
      console.log('No select for lang [' + goog.LOCALE + ']');
      continue;
    }
    var temp = goog.i18n.pluralRules.select.toString().
        replace(/function\s+\(/g, 'function(').
        replace(/goog\.i18n\.pluralRules\.Keyword/g, 'PLURAL_CATEGORY').
        replace(/goog\.i18n\.pluralRules\.get_vf_/g, 'getVF').
        replace(/goog\.i18n\.pluralRules\.get_wt_/g, 'getWT').
        replace(/goog\.i18n\.pluralRules\.decimals_/g, 'getDecimals').
        replace(/\n/g, '');

    ///@@ is a crazy place holder to be replaced before writing to file
    localeInfo[localeIds[i]].pluralCat = "@@" + temp + "@@";
  }
}

function correctedLocaleId(localeID) {
// e.g. from zh_CN to zh-CN, from en_US to en-US
  return localeID.replace(/_/g, '-').toLowerCase();
}

function canonicalizeForJsonStringify(unused_key, object) {
  // This function is intended to be called as the 2nd argument to
  // JSON.stringify.  The goal here is to ensure that the generated JSON has
  // objects with their keys in ascending order.  Without this, it's much
  // harder to diff the generated files in src/ngLocale as the order isn't
  // exactly consistent.  We've gotten lucky in the past.
  //
  // Iteration order, for string keys, ends up being the same as insertion
  // order.  Refer :-
  //    1. http://ejohn.org/blog/javascript-in-chrome/
  //       (search for "for loop order").
  //       Currently all major browsers loop over the properties of an object
  //       in the order in which they were defined.
  //         - John Resig
  //    2. https://code.google.com/p/v8/issues/detail?id=164
  //       ECMA-262 does not specify enumeration order. The de facto standard
  //       is to match insertion order, which V8 also does ...
  if (typeof object != "object" || Object.prototype.toString.apply(object) === '[object Array]') {
    return object;
  }
  var result = {};
  Object.keys(object).sort().forEach(function(key) {
    result[key] = object[key];
  });
  return result;
}

function serializeContent(localeObj) {
  return JSON.stringify(localeObj, canonicalizeForJsonStringify, '  ')
    .replace(new RegExp('[\\u007f-\\uffff]', 'g'), function(c) { return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4); })
    .replace(/"@@|@@"/g, '');
}

function outputLocale(localeInfo, localeID) {
  var fallBackID = localeID.match(/[A-Za-z]+/)[0],
      localeObj = localeInfo[localeID],
      fallBackObj = localeInfo[fallBackID];

  // fallBack to language formats when country format is missing
  // e.g. if NUMBER_FORMATS of en_xyz is not present, use the NUMBER_FORMATS of en instead
  if (!localeObj.NUMBER_FORMATS) {
    localeObj.NUMBER_FORMATS = fallBackObj.NUMBER_FORMATS;
  }

  // datetimesymbolsext.js provides more top level locales than the other
  // files.  We process datetimesymbolsext.js because we want the country
  // specific formats that are missing from datetimesymbols.js.  However, we
  // don't want to write locale files that only have dateformat (i.e. missing
  // number formats.)  So we skip them.
  if (!localeObj.NUMBER_FORMATS) {
    console.log("Skipping locale %j: Don't have any number formats", localeID);
    return null;
  }

  if (!localeObj.DATETIME_FORMATS) {
    localeObj.DATETIME_FORMATS = fallBackObj.DATETIME_FORMATS;
  }
  localeObj.id = correctedLocaleId(localeID);

  var getDecimals = [
    'function getDecimals(n) {',
    '  n = n + \'\';',
    '  var i = n.indexOf(\'.\');',
    '  return (i == -1) ? 0 : n.length - i - 1;',
    '}', '', ''
  ].join('\n');

  var getVF = [
    'function getVF(n, opt_precision) {',
    '  var v = opt_precision;', '',
    '  if (undefined === v) {',
    '    v = Math.min(getDecimals(n), 3);',
    '  }', '',
    '  var base = Math.pow(10, v);',
    '  var f = ((n * base) | 0) % base;',
    '  return {v: v, f: f};',
    '}', '', ''
  ].join('\n');

  var getWT =
  [
    'function getWT(v, f) {',
    '  if (f === 0) {',
    '    return {w: 0, t: 0};',
    '  }', '',
    '  while ((f % 10) === 0) {',
    '    f /= 10;',
    '    v--;',
    '  }', '',
    '  return {w: v, t: f};',
    '}', '', ''
  ].join('\n');

  localeObj = {
    DATETIME_FORMATS: localeObj.DATETIME_FORMATS,
    NUMBER_FORMATS: localeObj.NUMBER_FORMATS,
    pluralCat: localeObj.pluralCat,
    id: localeObj.id
  };

  var content = serializeContent(localeInfo[localeID]);
  if (content.indexOf('getVF(') < 0) {
    getVF = '';
  }
  if (content.indexOf('getWT(') < 0) {
    getWT = '';
  }
  if (!getVF && content.indexOf('getDecimals(') < 0) {
    getDecimals = '';
  }

  var prefix =
      "'use strict';\n" +
      'angular.module("ngLocale", [], ["$provide", function($provide) {\n' +
          'var PLURAL_CATEGORY = {' +
          'ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"' +
          '};\n' +
          getDecimals + getVF + getWT +
          '$provide.value("$locale", ';

  var suffix = ');\n}]);\n';

  return prefix + content + suffix;
}
