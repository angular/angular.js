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
      "\u2d5c\u2d49\u2d3c\u2d30\u2d61\u2d5c",
      "\u2d5c\u2d30\u2d37\u2d33\u2d33\u2d6f\u2d30\u2d5c"
    ],
    "DAY": [
      "\u2d30\u2d59\u2d30\u2d4e\u2d30\u2d59",
      "\u2d30\u2d62\u2d4f\u2d30\u2d59",
      "\u2d30\u2d59\u2d49\u2d4f\u2d30\u2d59",
      "\u2d30\u2d3d\u2d55\u2d30\u2d59",
      "\u2d30\u2d3d\u2d61\u2d30\u2d59",
      "\u2d30\u2d59\u2d49\u2d4e\u2d61\u2d30\u2d59",
      "\u2d30\u2d59\u2d49\u2d39\u2d62\u2d30\u2d59"
    ],
    "ERANAMES": [
      "\u2d37\u2d30\u2d5c \u2d4f \u2d44\u2d49\u2d59\u2d30",
      "\u2d37\u2d3c\u2d3c\u2d49\u2d54 \u2d4f \u2d44\u2d49\u2d59\u2d30"
    ],
    "ERAS": [
      "\u2d37\u2d30\u2d44",
      "\u2d37\u2d3c\u2d44"
    ],
    "MONTH": [
      "\u2d49\u2d4f\u2d4f\u2d30\u2d62\u2d54",
      "\u2d31\u2d55\u2d30\u2d62\u2d55",
      "\u2d4e\u2d30\u2d55\u2d5a",
      "\u2d49\u2d31\u2d54\u2d49\u2d54",
      "\u2d4e\u2d30\u2d62\u2d62\u2d53",
      "\u2d62\u2d53\u2d4f\u2d62\u2d53",
      "\u2d62\u2d53\u2d4d\u2d62\u2d53\u2d63",
      "\u2d56\u2d53\u2d5b\u2d5c",
      "\u2d5b\u2d53\u2d5c\u2d30\u2d4f\u2d31\u2d49\u2d54",
      "\u2d3d\u2d5c\u2d53\u2d31\u2d54",
      "\u2d4f\u2d53\u2d61\u2d30\u2d4f\u2d31\u2d49\u2d54",
      "\u2d37\u2d53\u2d4a\u2d30\u2d4f\u2d31\u2d49\u2d54"
    ],
    "SHORTDAY": [
      "\u2d30\u2d59\u2d30",
      "\u2d30\u2d62\u2d4f",
      "\u2d30\u2d59\u2d49",
      "\u2d30\u2d3d\u2d55",
      "\u2d30\u2d3d\u2d61",
      "\u2d30\u2d59\u2d49\u2d4e",
      "\u2d30\u2d59\u2d49\u2d39"
    ],
    "SHORTMONTH": [
      "\u2d49\u2d4f\u2d4f",
      "\u2d31\u2d55\u2d30",
      "\u2d4e\u2d30\u2d55",
      "\u2d49\u2d31\u2d54",
      "\u2d4e\u2d30\u2d62",
      "\u2d62\u2d53\u2d4f",
      "\u2d62\u2d53\u2d4d",
      "\u2d56\u2d53\u2d5b",
      "\u2d5b\u2d53\u2d5c",
      "\u2d3d\u2d5c\u2d53",
      "\u2d4f\u2d53\u2d61",
      "\u2d37\u2d53\u2d4a"
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
  "id": "zgh-ma",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
