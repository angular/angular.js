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
      "\u09aa\u09c2\u09f0\u09cd\u09ac\u09be\u09b9\u09cd\u09a3",
      "\u0985\u09aa\u09f0\u09be\u09b9\u09cd\u09a3"
    ],
    "DAY": [
      "\u09a6\u09c7\u0993\u09ac\u09be\u09f0",
      "\u09b8\u09cb\u09ae\u09ac\u09be\u09f0",
      "\u09ae\u0999\u09cd\u0997\u09b2\u09ac\u09be\u09f0",
      "\u09ac\u09c1\u09a7\u09ac\u09be\u09f0",
      "\u09ac\u09c3\u09b9\u09b7\u09cd\u09aa\u09a4\u09bf\u09ac\u09be\u09f0",
      "\u09b6\u09c1\u0995\u09cd\u09f0\u09ac\u09be\u09f0",
      "\u09b6\u09a8\u09bf\u09ac\u09be\u09f0"
    ],
    "MONTH": [
      "\u099c\u09be\u09a8\u09c1\u09f1\u09be\u09f0\u09c0",
      "\u09ab\u09c7\u09ac\u09cd\u09f0\u09c1\u09f1\u09be\u09f0\u09c0",
      "\u09ae\u09be\u09f0\u09cd\u099a",
      "\u098f\u09aa\u09cd\u09f0\u09bf\u09b2",
      "\u09ae\u09c7",
      "\u099c\u09c1\u09a8",
      "\u099c\u09c1\u09b2\u09be\u0987",
      "\u0986\u0997\u09b7\u09cd\u099f",
      "\u099b\u09c7\u09aa\u09cd\u09a4\u09c7\u09ae\u09cd\u09ac\u09f0",
      "\u0985\u0995\u09cd\u099f\u09cb\u09ac\u09f0",
      "\u09a8\u09f1\u09c7\u09ae\u09cd\u09ac\u09f0",
      "\u09a1\u09bf\u099a\u09c7\u09ae\u09cd\u09ac\u09f0"
    ],
    "SHORTDAY": [
      "\u09f0\u09ac\u09bf",
      "\u09b8\u09cb\u09ae",
      "\u09ae\u0999\u09cd\u0997\u09b2",
      "\u09ac\u09c1\u09a7",
      "\u09ac\u09c3\u09b9\u09b7\u09cd\u09aa\u09a4\u09bf",
      "\u09b6\u09c1\u0995\u09cd\u09f0",
      "\u09b6\u09a8\u09bf"
    ],
    "SHORTMONTH": [
      "\u099c\u09be\u09a8\u09c1",
      "\u09ab\u09c7\u09ac\u09cd\u09f0\u09c1",
      "\u09ae\u09be\u09f0\u09cd\u099a",
      "\u098f\u09aa\u09cd\u09f0\u09bf\u09b2",
      "\u09ae\u09c7",
      "\u099c\u09c1\u09a8",
      "\u099c\u09c1\u09b2\u09be\u0987",
      "\u0986\u0997",
      "\u09b8\u09c7\u09aa\u09cd\u099f",
      "\u0985\u0995\u09cd\u099f\u09cb",
      "\u09a8\u09ad\u09c7",
      "\u09a1\u09bf\u09b8\u09c7"
    ],
    "fullDate": "EEEE, d MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "dd-MM-y h.mm.ss a",
    "mediumDate": "dd-MM-y",
    "mediumTime": "h.mm.ss a",
    "short": "d-M-y h.mm. a",
    "shortDate": "d-M-y",
    "shortTime": "h.mm. a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20b9",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
    "PATTERNS": [
      {
        "gSize": 2,
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
        "gSize": 2,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "\u00a4\u00a0-",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "as",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
