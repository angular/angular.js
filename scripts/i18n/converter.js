/**
 * after obtaining data from closure files, use converter to massage the data into the formats
 * we want
 */
exports.convertDatetimeData = convertDatetimeData;
exports.convertNumberData = convertNumberData;
//export this method so we can test it
exports.convertDatetimeFormats = convertDatetimeFormats;


require.paths.push(__dirname);


var parsePattern = require('parser').parsePattern,
    currencySymbols = require('currencySymbols.js').getSymbols();


function convertNumberData(dataObj) {
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
    // if there is no corresponding currency symbol, just use currency code.
    var code = numberFormats.CURRENCY_SYM = dataObj.DEF_CURRENCY_CODE;
    console.log(code +' has no currency symbol, used ' + code + ' instead!');
  }
  return numberFormats;
}

function convertDatetimeData(dataObj) {
  var datetimeFormats = {};

  datetimeFormats.MONTH = dataObj.MONTHS;
  datetimeFormats.SHORTMONTH = dataObj.SHORTMONTHS;
  datetimeFormats.DAY = dataObj.WEEKDAYS;
  datetimeFormats.SHORTDAY = dataObj.SHORTWEEKDAYS;
  datetimeFormats.AMPMS = dataObj.AMPMS;

  convertDatetimeFormats(datetimeFormats, dataObj.DATEFORMATS, dataObj.TIMEFORMATS);
  return datetimeFormats;
}

/**
* add default formats to datetimeFormats object
* @param datetimeFormats {object}
* @param dateFormats {array}
* @param timeFormats {array}
*/
function convertDatetimeFormats(datetimeFormats, dateFormats, timeFormats) {
  if (dateFormats && timeFormats) {
    datetimeFormats.medium     = dateFormats[2] + ' ' + timeFormats[2];
    datetimeFormats.short      = dateFormats[3] + ' ' + timeFormats[3];
    datetimeFormats.fullDate   = dateFormats[0];
    datetimeFormats.longDate   = dateFormats[1];
    datetimeFormats.mediumDate  = dateFormats[2];
    datetimeFormats.shortDate  = dateFormats[3];
    datetimeFormats.mediumTime = timeFormats[2];
    datetimeFormats.shortTime  = timeFormats[3];
  }
}
