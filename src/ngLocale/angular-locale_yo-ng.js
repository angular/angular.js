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
      "\u00c0\u00e1r\u1ecd\u0300",
      "\u1ecc\u0300s\u00e1n"
    ],
    "DAY": [
      "\u1eccj\u1ecd\u0301 \u00c0\u00eck\u00fa",
      "\u1eccj\u1ecd\u0301 Aj\u00e9",
      "\u1eccj\u1ecd\u0301 \u00ccs\u1eb9\u0301gun",
      "\u1eccj\u1ecd\u0301r\u00fa",
      "\u1eccj\u1ecd\u0301b\u1ecd",
      "\u1eccj\u1ecd\u0301 \u1eb8t\u00ec",
      "\u1eccj\u1ecd\u0301 \u00c0b\u00e1m\u1eb9\u0301ta"
    ],
    "MONTH": [
      "O\u1e63\u00f9 \u1e62\u1eb9\u0301r\u1eb9\u0301",
      "O\u1e63\u00f9 \u00c8r\u00e8l\u00e8",
      "O\u1e63\u00f9 \u1eb8r\u1eb9\u0300n\u00e0",
      "O\u1e63\u00f9 \u00ccgb\u00e9",
      "O\u1e63\u00f9 \u1eb8\u0300bibi",
      "O\u1e63\u00f9 \u00d2k\u00fadu",
      "O\u1e63\u00f9 Ag\u1eb9m\u1ecd",
      "O\u1e63\u00f9 \u00d2g\u00fan",
      "O\u1e63\u00f9 Owewe",
      "O\u1e63\u00f9 \u1ecc\u0300w\u00e0r\u00e0",
      "O\u1e63\u00f9 B\u00e9l\u00fa",
      "O\u1e63\u00f9 \u1ecc\u0300p\u1eb9\u0300"
    ],
    "SHORTDAY": [
      "\u00c0\u00eck\u00fa",
      "Aj\u00e9",
      "\u00ccs\u1eb9\u0301gun",
      "\u1eccj\u1ecd\u0301r\u00fa",
      "\u1eccj\u1ecd\u0301b\u1ecd",
      "\u1eb8t\u00ec",
      "\u00c0b\u00e1m\u1eb9\u0301ta"
    ],
    "SHORTMONTH": [
      "\u1e62\u1eb9\u0301r\u1eb9\u0301",
      "\u00c8r\u00e8l\u00e8",
      "\u1eb8r\u1eb9\u0300n\u00e0",
      "\u00ccgb\u00e9",
      "\u1eb8\u0300bibi",
      "\u00d2k\u00fadu",
      "Ag\u1eb9m\u1ecd",
      "\u00d2g\u00fan",
      "Owewe",
      "\u1ecc\u0300w\u00e0r\u00e0",
      "B\u00e9l\u00fa",
      "\u1ecc\u0300p\u1eb9\u0300"
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
    "CURRENCY_SYM": "\u20a6",
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "yo-ng",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
