'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\uc624\uc804",
      "\uc624\ud6c4"
    ],
    "DAY": [
      "\uc77c\uc694\uc77c",
      "\uc6d4\uc694\uc77c",
      "\ud654\uc694\uc77c",
      "\uc218\uc694\uc77c",
      "\ubaa9\uc694\uc77c",
      "\uae08\uc694\uc77c",
      "\ud1a0\uc694\uc77c"
    ],
    "ERANAMES": [
      "\uae30\uc6d0\uc804",
      "\uc11c\uae30"
    ],
    "ERAS": [
      "\uae30\uc6d0\uc804",
      "\uc11c\uae30"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "1\uc6d4",
      "2\uc6d4",
      "3\uc6d4",
      "4\uc6d4",
      "5\uc6d4",
      "6\uc6d4",
      "7\uc6d4",
      "8\uc6d4",
      "9\uc6d4",
      "10\uc6d4",
      "11\uc6d4",
      "12\uc6d4"
    ],
    "SHORTDAY": [
      "\uc77c",
      "\uc6d4",
      "\ud654",
      "\uc218",
      "\ubaa9",
      "\uae08",
      "\ud1a0"
    ],
    "SHORTMONTH": [
      "1\uc6d4",
      "2\uc6d4",
      "3\uc6d4",
      "4\uc6d4",
      "5\uc6d4",
      "6\uc6d4",
      "7\uc6d4",
      "8\uc6d4",
      "9\uc6d4",
      "10\uc6d4",
      "11\uc6d4",
      "12\uc6d4"
    ],
    "STANDALONEMONTH": [
      "1\uc6d4",
      "2\uc6d4",
      "3\uc6d4",
      "4\uc6d4",
      "5\uc6d4",
      "6\uc6d4",
      "7\uc6d4",
      "8\uc6d4",
      "9\uc6d4",
      "10\uc6d4",
      "11\uc6d4",
      "12\uc6d4"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "y\ub144 M\uc6d4 d\uc77c EEEE",
    "longDate": "y\ub144 M\uc6d4 d\uc77c",
    "medium": "y. M. d. a h:mm:ss",
    "mediumDate": "y. M. d.",
    "mediumTime": "a h:mm:ss",
    "short": "yy. M. d. a h:mm",
    "shortDate": "yy. M. d.",
    "shortTime": "a h:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20a9KP",
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
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "ko-kp",
  "localeID": "ko_KP",
  "pluralCat": function(n, opt_precision) {  return PLURAL_CATEGORY.OTHER;}
});
}]);
