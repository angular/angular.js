'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
function getDecimals(n) {
  n = n + '';
  var i = n.indexOf('.');
  return (i == -1) ? 0 : n.length - i - 1;
}

function getVF(n, opt_precision) {
  var v = opt_precision;

  if (undefined === v) {
    v = Math.min(getDecimals(n), 3);
  }

  var base = Math.pow(10, v);
  var f = ((n * base) | 0) % base;
  return {v: v, f: f};
}

$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "atm",
      "ptm"
    ],
    "DAY": [
      "diman\u0109o",
      "lundo",
      "mardo",
      "merkredo",
      "\u0135a\u016ddo",
      "vendredo",
      "sabato"
    ],
    "ERANAMES": [
      "aK",
      "pK"
    ],
    "ERAS": [
      "aK",
      "pK"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "januaro",
      "februaro",
      "marto",
      "aprilo",
      "majo",
      "junio",
      "julio",
      "a\u016dgusto",
      "septembro",
      "oktobro",
      "novembro",
      "decembro"
    ],
    "SHORTDAY": [
      "di",
      "lu",
      "ma",
      "me",
      "\u0135a",
      "ve",
      "sa"
    ],
    "SHORTMONTH": [
      "jan",
      "feb",
      "mar",
      "apr",
      "maj",
      "jun",
      "jul",
      "a\u016dg",
      "sep",
      "okt",
      "nov",
      "dec"
    ],
    "STANDALONEMONTH": [
      "januaro",
      "februaro",
      "marto",
      "aprilo",
      "majo",
      "junio",
      "julio",
      "a\u016dgusto",
      "septembro",
      "oktobro",
      "novembro",
      "decembro"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d-'a' 'de' MMMM y",
    "longDate": "y-MMMM-dd",
    "medium": "y-MMM-dd HH:mm:ss",
    "mediumDate": "y-MMM-dd",
    "mediumTime": "HH:mm:ss",
    "short": "yy-MM-dd HH:mm",
    "shortDate": "yy-MM-dd",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "$",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": "\u00a0",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-\u00a4\u00a0",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "eo",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
