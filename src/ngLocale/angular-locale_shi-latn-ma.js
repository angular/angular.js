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
      "tifawt",
      "tadgg\u02b7at"
    ],
    "DAY": [
      "asamas",
      "aynas",
      "asinas",
      "ak\u1e5bas",
      "akwas",
      "asimwas",
      "asi\u1e0dyas"
    ],
    "ERANAMES": [
      "dat n \u025bisa",
      "dffir n \u025bisa"
    ],
    "ERAS": [
      "da\u025b",
      "df\u025b"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "innayr",
      "b\u1e5bay\u1e5b",
      "ma\u1e5b\u1e63",
      "ibrir",
      "mayyu",
      "yunyu",
      "yulyuz",
      "\u0263uct",
      "cutanbir",
      "ktubr",
      "nuwanbir",
      "dujanbir"
    ],
    "SHORTDAY": [
      "asa",
      "ayn",
      "asi",
      "ak\u1e5b",
      "akw",
      "asim",
      "asi\u1e0d"
    ],
    "SHORTMONTH": [
      "inn",
      "b\u1e5ba",
      "ma\u1e5b",
      "ibr",
      "may",
      "yun",
      "yul",
      "\u0263uc",
      "cut",
      "ktu",
      "nuw",
      "duj"
    ],
    "STANDALONEMONTH": [
      "innayr",
      "b\u1e5bay\u1e5b",
      "ma\u1e5b\u1e63",
      "ibrir",
      "mayyu",
      "yunyu",
      "yulyuz",
      "\u0263uct",
      "cutanbir",
      "ktubr",
      "nuwanbir",
      "dujanbir"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM, y HH:mm:ss",
    "mediumDate": "d MMM, y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/y HH:mm",
    "shortDate": "d/M/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "dh",
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
        "negSuf": "\u00a4",
        "posPre": "",
        "posSuf": "\u00a4"
      }
    ]
  },
  "id": "shi-latn-ma",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
