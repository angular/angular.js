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
      "\u05dc\u05e4\u05e0\u05d4\u05f4\u05e6",
      "\u05d0\u05d7\u05d4\u05f4\u05e6"
    ],
    "DAY": [
      "\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df",
      "\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9",
      "\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9",
      "\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9",
      "\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9",
      "\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9",
      "\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea"
    ],
    "MONTH": [
      "\u05d9\u05e0\u05d5\u05d0\u05e8",
      "\u05e4\u05d1\u05e8\u05d5\u05d0\u05e8",
      "\u05de\u05e8\u05e5",
      "\u05d0\u05e4\u05e8\u05d9\u05dc",
      "\u05de\u05d0\u05d9",
      "\u05d9\u05d5\u05e0\u05d9",
      "\u05d9\u05d5\u05dc\u05d9",
      "\u05d0\u05d5\u05d2\u05d5\u05e1\u05d8",
      "\u05e1\u05e4\u05d8\u05de\u05d1\u05e8",
      "\u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8",
      "\u05e0\u05d5\u05d1\u05de\u05d1\u05e8",
      "\u05d3\u05e6\u05de\u05d1\u05e8"
    ],
    "SHORTDAY": [
      "\u05d9\u05d5\u05dd \u05d0\u05f3",
      "\u05d9\u05d5\u05dd \u05d1\u05f3",
      "\u05d9\u05d5\u05dd \u05d2\u05f3",
      "\u05d9\u05d5\u05dd \u05d3\u05f3",
      "\u05d9\u05d5\u05dd \u05d4\u05f3",
      "\u05d9\u05d5\u05dd \u05d5\u05f3",
      "\u05e9\u05d1\u05ea"
    ],
    "SHORTMONTH": [
      "\u05d9\u05e0\u05d5\u05f3",
      "\u05e4\u05d1\u05e8\u05f3",
      "\u05de\u05e8\u05e5",
      "\u05d0\u05e4\u05e8\u05f3",
      "\u05de\u05d0\u05d9",
      "\u05d9\u05d5\u05e0\u05d9",
      "\u05d9\u05d5\u05dc\u05d9",
      "\u05d0\u05d5\u05d2\u05f3",
      "\u05e1\u05e4\u05d8\u05f3",
      "\u05d0\u05d5\u05e7\u05f3",
      "\u05e0\u05d5\u05d1\u05f3",
      "\u05d3\u05e6\u05de\u05f3"
    ],
    "fullDate": "EEEE, d \u05d1MMMM y",
    "longDate": "d \u05d1MMMM y",
    "medium": "d \u05d1MMM y HH:mm:ss",
    "mediumDate": "d \u05d1MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20aa",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "macFrac": 0,
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
        "macFrac": 0,
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
  "id": "iw",
  "pluralCat": function (n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  if (i == 2 && vf.v == 0) {    return PLURAL_CATEGORY.TWO;  }  if (vf.v == 0 && (n < 0 || n > 10) && n % 10 == 0) {    return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);