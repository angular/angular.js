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
      "\u10d9\u10d5\u10d8\u10e0\u10d0",
      "\u10dd\u10e0\u10e8\u10d0\u10d1\u10d0\u10d7\u10d8",
      "\u10e1\u10d0\u10db\u10e8\u10d0\u10d1\u10d0\u10d7\u10d8",
      "\u10dd\u10d7\u10ee\u10e8\u10d0\u10d1\u10d0\u10d7\u10d8",
      "\u10ee\u10e3\u10d7\u10e8\u10d0\u10d1\u10d0\u10d7\u10d8",
      "\u10de\u10d0\u10e0\u10d0\u10e1\u10d9\u10d4\u10d5\u10d8",
      "\u10e8\u10d0\u10d1\u10d0\u10d7\u10d8"
    ],
    "MONTH": [
      "\u10d8\u10d0\u10dc\u10d5\u10d0\u10e0\u10d8",
      "\u10d7\u10d4\u10d1\u10d4\u10e0\u10d5\u10d0\u10da\u10d8",
      "\u10db\u10d0\u10e0\u10e2\u10d8",
      "\u10d0\u10de\u10e0\u10d8\u10da\u10d8",
      "\u10db\u10d0\u10d8\u10e1\u10d8",
      "\u10d8\u10d5\u10dc\u10d8\u10e1\u10d8",
      "\u10d8\u10d5\u10da\u10d8\u10e1\u10d8",
      "\u10d0\u10d2\u10d5\u10d8\u10e1\u10e2\u10dd",
      "\u10e1\u10d4\u10e5\u10e2\u10d4\u10db\u10d1\u10d4\u10e0\u10d8",
      "\u10dd\u10e5\u10e2\u10dd\u10db\u10d1\u10d4\u10e0\u10d8",
      "\u10dc\u10dd\u10d4\u10db\u10d1\u10d4\u10e0\u10d8",
      "\u10d3\u10d4\u10d9\u10d4\u10db\u10d1\u10d4\u10e0\u10d8"
    ],
    "SHORTDAY": [
      "\u10d9\u10d5\u10d8",
      "\u10dd\u10e0\u10e8",
      "\u10e1\u10d0\u10db",
      "\u10dd\u10d7\u10ee",
      "\u10ee\u10e3\u10d7",
      "\u10de\u10d0\u10e0",
      "\u10e8\u10d0\u10d1"
    ],
    "SHORTMONTH": [
      "\u10d8\u10d0\u10dc",
      "\u10d7\u10d4\u10d1",
      "\u10db\u10d0\u10e0",
      "\u10d0\u10de\u10e0",
      "\u10db\u10d0\u10d8",
      "\u10d8\u10d5\u10dc",
      "\u10d8\u10d5\u10da",
      "\u10d0\u10d2\u10d5",
      "\u10e1\u10d4\u10e5",
      "\u10dd\u10e5\u10e2",
      "\u10dc\u10dd\u10d4",
      "\u10d3\u10d4\u10d9"
    ],
    "fullDate": "EEEE, dd MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "d MMM, y HH:mm:ss",
    "mediumDate": "d MMM, y",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "GEL",
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
  "id": "ka",
  "pluralCat": function(n, opt_precision) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
