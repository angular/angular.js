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
      "domingu",
      "llunes",
      "martes",
      "mi\u00e9rcoles",
      "xueves",
      "vienres",
      "s\u00e1badu"
    ],
    "MONTH": [
      "de xineru",
      "de febreru",
      "de marzu",
      "d\u2019abril",
      "de mayu",
      "de xunu",
      "de xunetu",
      "d\u2019agostu",
      "de setiembre",
      "d\u2019ochobre",
      "de payares",
      "d\u2019avientu"
    ],
    "SHORTDAY": [
      "dom",
      "llu",
      "mar",
      "mie",
      "xue",
      "vie",
      "sab"
    ],
    "SHORTMONTH": [
      "xin",
      "feb",
      "mar",
      "abr",
      "may",
      "xun",
      "xnt",
      "ago",
      "set",
      "och",
      "pay",
      "avi"
    ],
    "fullDate": "EEEE, d MMMM 'de' y",
    "longDate": "d MMMM 'de' y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/yy HH:mm",
    "shortDate": "d/M/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
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
  "id": "ast",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
