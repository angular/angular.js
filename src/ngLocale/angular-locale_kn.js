'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "AM",
      "PM"
    ],
    "DAY": [
      "\u0cb0\u0cb5\u0cbf\u0cb5\u0cbe\u0cb0",
      "\u0cb8\u0ccb\u0cae\u0cb5\u0cbe\u0cb0",
      "\u0cae\u0c82\u0c97\u0cb3\u0cb5\u0cbe\u0cb0",
      "\u0cac\u0cc1\u0ca7\u0cb5\u0cbe\u0cb0",
      "\u0c97\u0cc1\u0cb0\u0cc1\u0cb5\u0cbe\u0cb0",
      "\u0cb6\u0cc1\u0c95\u0ccd\u0cb0\u0cb5\u0cbe\u0cb0",
      "\u0cb6\u0ca8\u0cbf\u0cb5\u0cbe\u0cb0"
    ],
    "MONTH": [
      "\u0c9c\u0ca8\u0cb5\u0cb0\u0cbf",
      "\u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cbf",
      "\u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd",
      "\u0c8f\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd",
      "\u0cae\u0cc7",
      "\u0c9c\u0cc2\u0ca8\u0ccd",
      "\u0c9c\u0cc1\u0cb2\u0cc8",
      "\u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd",
      "\u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd",
      "\u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd",
      "\u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd",
      "\u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd"
    ],
    "SHORTDAY": [
      "\u0cb0.",
      "\u0cb8\u0ccb.",
      "\u0cae\u0c82.",
      "\u0cac\u0cc1.",
      "\u0c97\u0cc1.",
      "\u0cb6\u0cc1.",
      "\u0cb6\u0ca8\u0cbf."
    ],
    "SHORTMONTH": [
      "\u0c9c\u0ca8.",
      "\u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cc1.",
      "\u0cae\u0cbe",
      "\u0c8f\u0caa\u0ccd\u0cb0\u0cbf.",
      "\u0cae\u0cc7",
      "\u0c9c\u0cc2",
      "\u0c9c\u0cc1.",
      "\u0c86\u0c97.",
      "\u0cb8\u0cc6\u0caa\u0ccd\u0c9f\u0cc6\u0c82.",
      "\u0c85\u0c95\u0ccd\u0c9f\u0ccb.",
      "\u0ca8\u0cb5\u0cc6\u0c82.",
      "\u0ca1\u0cbf\u0cb8\u0cc6\u0c82."
    ],
    "fullDate": "d MMMM y, EEEE",
    "longDate": "d MMMM y",
    "medium": "d MMM y hh:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "hh:mm:ss a",
    "short": "d-M-yy hh:mm a",
    "shortDate": "d-M-yy",
    "shortTime": "hh:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20b9",
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
  "id": "kn",
  "pluralCat": function (n, opt_precision) {  var i = n | 0;  if (i == 0 || n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);