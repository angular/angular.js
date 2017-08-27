'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u0e81\u0ec8\u0ead\u0e99\u0e97\u0ec8\u0ebd\u0e87",
      "\u0eab\u0ebc\u0eb1\u0e87\u0e97\u0ec8\u0ebd\u0e87"
    ],
    "DAY": [
      "\u0ea7\u0eb1\u0e99\u0ead\u0eb2\u0e97\u0eb4\u0e94",
      "\u0ea7\u0eb1\u0e99\u0e88\u0eb1\u0e99",
      "\u0ea7\u0eb1\u0e99\u0ead\u0eb1\u0e87\u0e84\u0eb2\u0e99",
      "\u0ea7\u0eb1\u0e99\u0e9e\u0eb8\u0e94",
      "\u0ea7\u0eb1\u0e99\u0e9e\u0eb0\u0eab\u0eb1\u0e94",
      "\u0ea7\u0eb1\u0e99\u0eaa\u0eb8\u0e81",
      "\u0ea7\u0eb1\u0e99\u0ec0\u0eaa\u0ebb\u0eb2"
    ],
    "ERANAMES": [
      "\u0e81\u0ec8\u0ead\u0e99\u0e84\u0ea3\u0eb4\u0e94\u0eaa\u0eb1\u0e81\u0e81\u0eb0\u0ea5\u0eb2\u0e94",
      "\u0e84\u0ea3\u0eb4\u0e94\u0eaa\u0eb1\u0e81\u0e81\u0eb0\u0ea5\u0eb2\u0e94"
    ],
    "ERAS": [
      "\u0e81\u0ec8\u0ead\u0e99 \u0e84.\u0eaa.",
      "\u0e84.\u0eaa."
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "\u0ea1\u0eb1\u0e87\u0e81\u0ead\u0e99",
      "\u0e81\u0eb8\u0ea1\u0e9e\u0eb2",
      "\u0ea1\u0eb5\u0e99\u0eb2",
      "\u0ec0\u0ea1\u0eaa\u0eb2",
      "\u0e9e\u0eb6\u0e94\u0eaa\u0eb0\u0e9e\u0eb2",
      "\u0ea1\u0eb4\u0e96\u0eb8\u0e99\u0eb2",
      "\u0e81\u0ecd\u0ea5\u0eb0\u0e81\u0ebb\u0e94",
      "\u0eaa\u0eb4\u0e87\u0eab\u0eb2",
      "\u0e81\u0eb1\u0e99\u0e8d\u0eb2",
      "\u0e95\u0eb8\u0ea5\u0eb2",
      "\u0e9e\u0eb0\u0e88\u0eb4\u0e81",
      "\u0e97\u0eb1\u0e99\u0ea7\u0eb2"
    ],
    "SHORTDAY": [
      "\u0ead\u0eb2\u0e97\u0eb4\u0e94",
      "\u0e88\u0eb1\u0e99",
      "\u0ead\u0eb1\u0e87\u0e84\u0eb2\u0e99",
      "\u0e9e\u0eb8\u0e94",
      "\u0e9e\u0eb0\u0eab\u0eb1\u0e94",
      "\u0eaa\u0eb8\u0e81",
      "\u0ec0\u0eaa\u0ebb\u0eb2"
    ],
    "SHORTMONTH": [
      "\u0ea1.\u0e81.",
      "\u0e81.\u0e9e.",
      "\u0ea1.\u0e99.",
      "\u0ea1.\u0eaa.",
      "\u0e9e.\u0e9e.",
      "\u0ea1\u0eb4.\u0e96.",
      "\u0e81.\u0ea5.",
      "\u0eaa.\u0eab.",
      "\u0e81.\u0e8d.",
      "\u0e95.\u0ea5.",
      "\u0e9e.\u0e88.",
      "\u0e97.\u0ea7."
    ],
    "STANDALONEMONTH": [
      "\u0ea1\u0eb1\u0e87\u0e81\u0ead\u0e99",
      "\u0e81\u0eb8\u0ea1\u0e9e\u0eb2",
      "\u0ea1\u0eb5\u0e99\u0eb2",
      "\u0ec0\u0ea1\u0eaa\u0eb2",
      "\u0e9e\u0eb6\u0e94\u0eaa\u0eb0\u0e9e\u0eb2",
      "\u0ea1\u0eb4\u0e96\u0eb8\u0e99\u0eb2",
      "\u0e81\u0ecd\u0ea5\u0eb0\u0e81\u0ebb\u0e94",
      "\u0eaa\u0eb4\u0e87\u0eab\u0eb2",
      "\u0e81\u0eb1\u0e99\u0e8d\u0eb2",
      "\u0e95\u0eb8\u0ea5\u0eb2",
      "\u0e9e\u0eb0\u0e88\u0eb4\u0e81",
      "\u0e97\u0eb1\u0e99\u0ea7\u0eb2"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE \u0e97\u0eb5 d MMMM G y",
    "longDate": "d MMMM y",
    "medium": "d MMM y H:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "H:mm:ss",
    "short": "d/M/y H:mm",
    "shortDate": "d/M/y",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ad",
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
        "maxFrac": 0,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "lo-la",
  "localeID": "lo_LA",
  "pluralCat": function(n, opt_precision) {  return PLURAL_CATEGORY.OTHER;}
});
}]);
