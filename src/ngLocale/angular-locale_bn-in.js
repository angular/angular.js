'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "am",
      "pm"
    ],
    "DAY": [
      "\u09b0\u09ac\u09bf\u09ac\u09be\u09b0",
      "\u09b8\u09cb\u09ae\u09ac\u09be\u09b0",
      "\u09ae\u0999\u09cd\u0997\u09b2\u09ac\u09be\u09b0",
      "\u09ac\u09c1\u09a7\u09ac\u09be\u09b0",
      "\u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf\u09ac\u09be\u09b0",
      "\u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0",
      "\u09b6\u09a8\u09bf\u09ac\u09be\u09b0"
    ],
    "ERANAMES": [
      "\u0996\u09cd\u09b0\u09bf\u09b8\u09cd\u099f\u09aa\u09c2\u09b0\u09cd\u09ac",
      "\u0996\u09c3\u09b7\u09cd\u099f\u09be\u09ac\u09cd\u09a6"
    ],
    "ERAS": [
      "\u0996\u09cd\u09b0\u09bf\u09b8\u09cd\u099f\u09aa\u09c2\u09b0\u09cd\u09ac",
      "\u0996\u09c3\u09b7\u09cd\u099f\u09be\u09ac\u09cd\u09a6"
    ],
    "MONTH": [
      "\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0",
      "\u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0",
      "\u09ae\u09be\u09b0\u09cd\u099a",
      "\u098f\u09aa\u09cd\u09b0\u09bf\u09b2",
      "\u09ae\u09c7",
      "\u099c\u09c1\u09a8",
      "\u099c\u09c1\u09b2\u09be\u0987",
      "\u0986\u0997\u09b8\u09cd\u099f",
      "\u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0",
      "\u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0",
      "\u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0",
      "\u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0"
    ],
    "SHORTDAY": [
      "\u09b0\u09ac\u09bf",
      "\u09b8\u09cb\u09ae",
      "\u09ae\u0999\u09cd\u0997\u09b2",
      "\u09ac\u09c1\u09a7",
      "\u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf",
      "\u09b6\u09c1\u0995\u09cd\u09b0",
      "\u09b6\u09a8\u09bf"
    ],
    "SHORTMONTH": [
      "\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0",
      "\u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0",
      "\u09ae\u09be\u09b0\u09cd\u099a",
      "\u098f\u09aa\u09cd\u09b0\u09bf\u09b2",
      "\u09ae\u09c7",
      "\u099c\u09c1\u09a8",
      "\u099c\u09c1\u09b2\u09be\u0987",
      "\u0986\u0997\u09b8\u09cd\u099f",
      "\u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0",
      "\u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0",
      "\u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0",
      "\u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0"
    ],
    "fullDate": "EEEE, d MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "d MMM, y h:mm:ss a",
    "mediumDate": "d MMM, y",
    "mediumTime": "h:mm:ss a",
    "short": "d/M/yy h:mm a",
    "shortDate": "d/M/yy",
    "shortTime": "h:mm a"
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
        "negPre": "-",
        "negSuf": "\u00a4",
        "posPre": "",
        "posSuf": "\u00a4"
      }
    ]
  },
  "id": "bn-in",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  if (i == 0 || n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
