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
      "lahadi",
      "t\u025b\u025bn\u025b\u025b",
      "talata",
      "alaba",
      "aimisa",
      "aijima",
      "si\u0253iti"
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
      "luukao kem\u00e3",
      "\u0253anda\u0253u",
      "v\u0254\u0254",
      "fulu",
      "goo",
      "6",
      "7",
      "k\u0254nde",
      "saah",
      "galo",
      "kenpkato \u0253olol\u0254",
      "luukao l\u0254ma"
    ],
    "SHORTDAY": [
      "lahadi",
      "t\u025b\u025bn\u025b\u025b",
      "talata",
      "alaba",
      "aimisa",
      "aijima",
      "si\u0253iti"
    ],
    "SHORTMONTH": [
      "luukao kem\u00e3",
      "\u0253anda\u0253u",
      "v\u0254\u0254",
      "fulu",
      "goo",
      "6",
      "7",
      "k\u0254nde",
      "saah",
      "galo",
      "kenpkato \u0253olol\u0254",
      "luukao l\u0254ma"
    ],
    "STANDALONEMONTH": [
      "luukao kem\u00e3",
      "\u0253anda\u0253u",
      "v\u0254\u0254",
      "fulu",
      "goo",
      "6",
      "7",
      "k\u0254nde",
      "saah",
      "galo",
      "kenpkato \u0253olol\u0254",
      "luukao l\u0254ma"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "dd/MM/y h:mm a",
    "shortDate": "dd/MM/y",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "$",
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
  "id": "vai-latn-lr",
  "localeID": "vai_Latn_LR",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
