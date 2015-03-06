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
      "idi\u0253a",
      "eby\u00e1mu"
    ],
    "DAY": [
      "\u00e9ti",
      "m\u0254\u0301s\u00fa",
      "kwas\u00fa",
      "muk\u0254\u0301s\u00fa",
      "\u014bgis\u00fa",
      "\u0257\u00f3n\u025bs\u00fa",
      "esa\u0253as\u00fa"
    ],
    "ERANAMES": [
      "\u0253oso \u0253w\u00e1 y\u00e1\u0253e l\u00e1",
      "mb\u00fasa kw\u00e9di a Y\u00e9s"
    ],
    "ERAS": [
      "\u0253.Ys",
      "mb.Ys"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "dim\u0254\u0301di",
      "\u014bg\u0254nd\u025b",
      "s\u0254\u014b\u025b",
      "di\u0253\u00e1\u0253\u00e1",
      "emiasele",
      "es\u0254p\u025bs\u0254p\u025b",
      "madi\u0253\u025b\u0301d\u00ed\u0253\u025b\u0301",
      "di\u014bgindi",
      "ny\u025bt\u025bki",
      "may\u00e9s\u025b\u0301",
      "tin\u00edn\u00ed",
      "el\u00e1\u014bg\u025b\u0301"
    ],
    "SHORTDAY": [
      "\u00e9t",
      "m\u0254\u0301s",
      "kwa",
      "muk",
      "\u014bgi",
      "\u0257\u00f3n",
      "esa"
    ],
    "SHORTMONTH": [
      "di",
      "\u014bg\u0254n",
      "s\u0254\u014b",
      "di\u0253",
      "emi",
      "es\u0254",
      "mad",
      "di\u014b",
      "ny\u025bt",
      "may",
      "tin",
      "el\u00e1"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/y HH:mm",
    "shortDate": "d/M/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "FCFA",
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
  "id": "dua",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
