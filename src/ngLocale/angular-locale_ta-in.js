'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u0bae\u0bc1\u0bb1\u0bcd\u0baa\u0b95\u0bb2\u0bcd",
      "\u0baa\u0bbf\u0bb1\u0bcd\u0baa\u0b95\u0bb2\u0bcd"
    ],
    "DAY": [
      "\u0b9e\u0bbe\u0baf\u0bbf\u0bb1\u0bc1",
      "\u0ba4\u0bbf\u0b99\u0bcd\u0b95\u0bb3\u0bcd",
      "\u0b9a\u0bc6\u0bb5\u0bcd\u0bb5\u0bbe\u0baf\u0bcd",
      "\u0baa\u0bc1\u0ba4\u0ba9\u0bcd",
      "\u0bb5\u0bbf\u0baf\u0bbe\u0bb4\u0ba9\u0bcd",
      "\u0bb5\u0bc6\u0bb3\u0bcd\u0bb3\u0bbf",
      "\u0b9a\u0ba9\u0bbf"
    ],
    "ERANAMES": [
      "\u0b95\u0bbf\u0bb1\u0bbf\u0bb8\u0bcd\u0ba4\u0bc1\u0bb5\u0bc1\u0b95\u0bcd\u0b95\u0bc1 \u0bae\u0bc1\u0ba9\u0bcd",
      "\u0b85\u0ba9\u0bcb \u0b9f\u0bcb\u0bae\u0bbf\u0ba9\u0bbf"
    ],
    "ERAS": [
      "\u0b95\u0bbf.\u0bae\u0bc1.",
      "\u0b95\u0bbf.\u0baa\u0bbf."
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "\u0b9c\u0ba9\u0bb5\u0bb0\u0bbf",
      "\u0baa\u0bbf\u0baa\u0bcd\u0bb0\u0bb5\u0bb0\u0bbf",
      "\u0bae\u0bbe\u0bb0\u0bcd\u0b9a\u0bcd",
      "\u0b8f\u0baa\u0bcd\u0bb0\u0bb2\u0bcd",
      "\u0bae\u0bc7",
      "\u0b9c\u0bc2\u0ba9\u0bcd",
      "\u0b9c\u0bc2\u0bb2\u0bc8",
      "\u0b86\u0b95\u0bb8\u0bcd\u0b9f\u0bcd",
      "\u0b9a\u0bc6\u0baa\u0bcd\u0b9f\u0bae\u0bcd\u0baa\u0bb0\u0bcd",
      "\u0b85\u0b95\u0bcd\u0b9f\u0bcb\u0baa\u0bb0\u0bcd",
      "\u0ba8\u0bb5\u0bae\u0bcd\u0baa\u0bb0\u0bcd",
      "\u0b9f\u0bbf\u0b9a\u0bae\u0bcd\u0baa\u0bb0\u0bcd"
    ],
    "SHORTDAY": [
      "\u0b9e\u0bbe",
      "\u0ba4\u0bbf",
      "\u0b9a\u0bc6",
      "\u0baa\u0bc1",
      "\u0bb5\u0bbf",
      "\u0bb5\u0bc6",
      "\u0b9a"
    ],
    "SHORTMONTH": [
      "\u0b9c\u0ba9.",
      "\u0baa\u0bbf\u0baa\u0bcd.",
      "\u0bae\u0bbe\u0bb0\u0bcd.",
      "\u0b8f\u0baa\u0bcd.",
      "\u0bae\u0bc7",
      "\u0b9c\u0bc2\u0ba9\u0bcd",
      "\u0b9c\u0bc2\u0bb2\u0bc8",
      "\u0b86\u0b95.",
      "\u0b9a\u0bc6\u0baa\u0bcd.",
      "\u0b85\u0b95\u0bcd.",
      "\u0ba8\u0bb5.",
      "\u0b9f\u0bbf\u0b9a."
    ],
    "WEEKENDRANGE": [
      6,
      6
    ],
    "fullDate": "EEEE, d MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "d MMM, y h:mm:ss a",
    "mediumDate": "d MMM, y",
    "mediumTime": "h:mm:ss a",
    "short": "d-M-yy h:mm a",
    "shortDate": "d-M-yy",
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
        "negPre": "-\u00a4\u00a0",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "ta-in",
  "pluralCat": function(n, opt_precision) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
