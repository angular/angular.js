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
      "\u0128yakwakya",
      "\u0128yaw\u0129oo"
    ],
    "DAY": [
      "Wa kyumwa",
      "Wa kwamb\u0129l\u0129lya",
      "Wa kel\u0129",
      "Wa katat\u0169",
      "Wa kana",
      "Wa katano",
      "Wa thanthat\u0169"
    ],
    "ERANAMES": [
      "Mbee wa Yes\u0169",
      "\u0128tina wa Yes\u0169"
    ],
    "ERAS": [
      "MY",
      "IY"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Mwai wa mbee",
      "Mwai wa kel\u0129",
      "Mwai wa katat\u0169",
      "Mwai wa kana",
      "Mwai wa katano",
      "Mwai wa thanthat\u0169",
      "Mwai wa muonza",
      "Mwai wa nyaanya",
      "Mwai wa kenda",
      "Mwai wa \u0129kumi",
      "Mwai wa \u0129kumi na \u0129mwe",
      "Mwai wa \u0129kumi na il\u0129"
    ],
    "SHORTDAY": [
      "Wky",
      "Wkw",
      "Wkl",
      "Wt\u0169",
      "Wkn",
      "Wtn",
      "Wth"
    ],
    "SHORTMONTH": [
      "Mbe",
      "Kel",
      "Kt\u0169",
      "Kan",
      "Ktn",
      "Tha",
      "Moo",
      "Nya",
      "Knd",
      "\u0128ku",
      "\u0128km",
      "\u0128kl"
    ],
    "STANDALONEMONTH": [
      "Mwai wa mbee",
      "Mwai wa kel\u0129",
      "Mwai wa katat\u0169",
      "Mwai wa kana",
      "Mwai wa katano",
      "Mwai wa thanthat\u0169",
      "Mwai wa muonza",
      "Mwai wa nyaanya",
      "Mwai wa kenda",
      "Mwai wa \u0129kumi",
      "Mwai wa \u0129kumi na \u0129mwe",
      "Mwai wa \u0129kumi na il\u0129"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/y HH:mm",
    "shortDate": "dd/MM/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Ksh",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
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
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "kam-ke",
  "localeID": "kam_KE",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
