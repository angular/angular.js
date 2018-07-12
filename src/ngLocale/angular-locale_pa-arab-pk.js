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
      "\u0627\u062a\u0648\u0627\u0631",
      "\u067e\u06cc\u0631",
      "\u0645\u0646\u06af\u0644",
      "\u0628\u064f\u062f\u06be",
      "\u062c\u0645\u0639\u0631\u0627\u062a",
      "\u062c\u0645\u0639\u06c1",
      "\u06c1\u0641\u062a\u06c1"
    ],
    "ERANAMES": [
      "\u0627\u064a\u0633\u0627\u067e\u0648\u0631\u0648",
      "\u0633\u06ba"
    ],
    "ERAS": [
      "\u0627\u064a\u0633\u0627\u067e\u0648\u0631\u0648",
      "\u0633\u06ba"
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "\u062c\u0646\u0648\u0631\u06cc",
      "\u0641\u0631\u0648\u0631\u06cc",
      "\u0645\u0627\u0631\u0686",
      "\u0627\u067e\u0631\u06cc\u0644",
      "\u0645\u0626",
      "\u062c\u0648\u0646",
      "\u062c\u0648\u0644\u0627\u0626\u06cc",
      "\u0627\u06af\u0633\u062a",
      "\u0633\u062a\u0645\u0628\u0631",
      "\u0627\u06a9\u062a\u0648\u0628\u0631",
      "\u0646\u0648\u0645\u0628\u0631",
      "\u062f\u0633\u0645\u0628\u0631"
    ],
    "SHORTDAY": [
      "\u0627\u062a\u0648\u0627\u0631",
      "\u067e\u06cc\u0631",
      "\u0645\u0646\u06af\u0644",
      "\u0628\u064f\u062f\u06be",
      "\u062c\u0645\u0639\u0631\u0627\u062a",
      "\u062c\u0645\u0639\u06c1",
      "\u06c1\u0641\u062a\u06c1"
    ],
    "SHORTMONTH": [
      "\u062c\u0646\u0648\u0631\u06cc",
      "\u0641\u0631\u0648\u0631\u06cc",
      "\u0645\u0627\u0631\u0686",
      "\u0627\u067e\u0631\u06cc\u0644",
      "\u0645\u0626",
      "\u062c\u0648\u0646",
      "\u062c\u0648\u0644\u0627\u0626\u06cc",
      "\u0627\u06af\u0633\u062a",
      "\u0633\u062a\u0645\u0628\u0631",
      "\u0627\u06a9\u062a\u0648\u0628\u0631",
      "\u0646\u0648\u0645\u0628\u0631",
      "\u062f\u0633\u0645\u0628\u0631"
    ],
    "STANDALONEMONTH": [
      "\u062c\u0646\u0648\u0631\u06cc",
      "\u0641\u0631\u0648\u0631\u06cc",
      "\u0645\u0627\u0631\u0686",
      "\u0627\u067e\u0631\u06cc\u0644",
      "\u0645\u0626",
      "\u062c\u0648\u0646",
      "\u062c\u0648\u0644\u0627\u0626\u06cc",
      "\u0627\u06af\u0633\u062a",
      "\u0633\u062a\u0645\u0628\u0631",
      "\u0627\u06a9\u062a\u0648\u0628\u0631",
      "\u0646\u0648\u0645\u0628\u0631",
      "\u062f\u0633\u0645\u0628\u0631"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, dd MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "dd/MM/y h:mm a",
    "shortDate": "dd/MM/y",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Rs",
    "DECIMAL_SEP": "\u066b",
    "GROUP_SEP": "\u066c",
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
        "negPre": "-\u00a4\u00a0",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "pa-arab-pk",
  "localeID": "pa_Arab_PK",
  "pluralCat": function(n, opt_precision) {  if (n >= 0 && n <= 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
