/**
 * after obtaining data from closure files, use converter to massage the data into the formats
 * we want
 */
exports.convertDatetimeData = convertDatetimeData;
exports.convertNumberData = convertNumberData;


var parsePattern = require('./parser').parsePattern;


function convertNumberData(dataObj, currencySymbols) {
  var numberFormats = {},

  numberFormats = {
    DECIMAL_SEP: dataObj.DECIMAL_SEP,
    GROUP_SEP: dataObj.GROUP_SEP,
    PATTERNS: [parsePattern(dataObj.DECIMAL_PATTERN),
               parsePattern(dataObj.CURRENCY_PATTERN)]
  }

  if (currencySymbols[dataObj.DEF_CURRENCY_CODE]) {
    numberFormats.CURRENCY_SYM = currencySymbols[dataObj.DEF_CURRENCY_CODE][1];
  } else {
    if (dataObj.DEF_CURRENCY_CODE == 'MTL') {
      numberFormats.CURRENCY_SYM = '₤'; //for some reason this is missing in closure
    } else {
      // if there is no corresponding currency symbol, just use currency code.
      var code = numberFormats.CURRENCY_SYM = dataObj.DEF_CURRENCY_CODE;
      console.log(code +' has no currency symbol in closure, used ' + code + ' instead!');
    }
  }
  return numberFormats;
}


function convertDatetimeData(dataObj) {
  var datetimeFormats = {};

  datetimeFormats.MONTH = dataObj.MONTHS;
  datetimeFormats.SHORTMONTH = dataObj.SHORTMONTHS;
  datetimeFormats.STANDALONEMONTH = dataObj.STANDALONEMONTHS;
  datetimeFormats.DAY = dataObj.WEEKDAYS;
  datetimeFormats.SHORTDAY = dataObj.SHORTWEEKDAYS;
  datetimeFormats.AMPMS = dataObj.AMPMS;
  datetimeFormats.FIRSTDAYOFWEEK = dataObj.FIRSTDAYOFWEEK;
  datetimeFormats.WEEKENDRANGE = dataObj.WEEKENDRANGE;
  datetimeFormats.ERAS = dataObj.ERAS;
  datetimeFormats.ERANAMES = dataObj.ERANAMES;


  datetimeFormats.medium      = dataObj.DATEFORMATS[2] + ' ' + dataObj.TIMEFORMATS[2];
  datetimeFormats.short       = dataObj.DATEFORMATS[3] + ' ' + dataObj.TIMEFORMATS[3];
  datetimeFormats.fullDate    = dataObj.DATEFORMATS[0];
  datetimeFormats.longDate    = dataObj.DATEFORMATS[1];
  datetimeFormats.mediumDate  = dataObj.DATEFORMATS[2];
  datetimeFormats.shortDate   = dataObj.DATEFORMATS[3];
  datetimeFormats.mediumTime  = dataObj.TIMEFORMATS[2];
  datetimeFormats.shortTime   = dataObj.TIMEFORMATS[3];

  return datetimeFormats;
}
