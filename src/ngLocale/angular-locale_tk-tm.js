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
      "AM",
      "PM"
    ],
    "DAY": [
      "\u00fdek\u015fenbe",
      "du\u015fenbe",
      "si\u015fenbe",
      "\u00e7ar\u015fenbe",
      "pen\u015fenbe",
      "anna",
      "\u015fenbe"
    ],
    "ERANAMES": [
      "BCE",
      "CE"
    ],
    "ERAS": [
      "BCE",
      "CE"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "\u00fdanwar",
      "fewral",
      "mart",
      "aprel",
      "ma\u00fd",
      "i\u00fdun",
      "i\u00fdul",
      "awgust",
      "sent\u00fdabr",
      "okt\u00fdabr",
      "no\u00fdabr",
      "dekabr"
    ],
    "SHORTDAY": [
      "\u00fdb",
      "db",
      "sb",
      "\u00e7b",
      "pb",
      "an",
      "\u015fb"
    ],
    "SHORTMONTH": [
      "\u00fdan",
      "few",
      "mart",
      "apr",
      "ma\u00fd",
      "i\u00fdun",
      "i\u00fdul",
      "awg",
      "sen",
      "okt",
      "no\u00fd",
      "dek"
    ],
    "STANDALONEMONTH": [
      "\u00fdanwar",
      "fewral",
      "mart",
      "aprel",
      "ma\u00fd",
      "i\u00fdun",
      "i\u00fdul",
      "awgust",
      "sent\u00fdabr",
      "okt\u00fdabr",
      "no\u00fdabr",
      "dekabr"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "d MMMM y EEEE",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.y HH:mm",
    "shortDate": "dd.MM.y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "TMT",
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
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "tk-tm",
  "localeID": "tk_TM",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
