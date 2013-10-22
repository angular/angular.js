'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\ud801\udc08\ud801\udc23",
      "\ud801\udc11\ud801\udc23"
    ],
    "DAY": [
      "\ud801\udc1d\ud801\udc32\ud801\udc4c\ud801\udc3c\ud801\udc29",
      "\ud801\udc23\ud801\udc32\ud801\udc4c\ud801\udc3c\ud801\udc29",
      "\ud801\udc13\ud801\udc2d\ud801\udc46\ud801\udc3c\ud801\udc29",
      "\ud801\udc0e\ud801\udc2f\ud801\udc4c\ud801\udc46\ud801\udc3c\ud801\udc29",
      "\ud801\udc1b\ud801\udc32\ud801\udc49\ud801\udc46\ud801\udc3c\ud801\udc29",
      "\ud801\udc19\ud801\udc49\ud801\udc34\ud801\udc3c\ud801\udc29",
      "\ud801\udc1d\ud801\udc30\ud801\udc3b\ud801\udc32\ud801\udc49\ud801\udc3c\ud801\udc29"
    ],
    "MONTH": [
      "\ud801\udc16\ud801\udc30\ud801\udc4c\ud801\udc37\ud801\udc2d\ud801\udc2f\ud801\udc49\ud801\udc28",
      "\ud801\udc19\ud801\udc2f\ud801\udc3a\ud801\udc49\ud801\udc2d\ud801\udc2f\ud801\udc49\ud801\udc28",
      "\ud801\udc23\ud801\udc2a\ud801\udc49\ud801\udc3d",
      "\ud801\udc01\ud801\udc39\ud801\udc49\ud801\udc2e\ud801\udc4a",
      "\ud801\udc23\ud801\udc29",
      "\ud801\udc16\ud801\udc2d\ud801\udc4c",
      "\ud801\udc16\ud801\udc2d\ud801\udc4a\ud801\udc34",
      "\ud801\udc02\ud801\udc40\ud801\udc32\ud801\udc45\ud801\udc3b",
      "\ud801\udc1d\ud801\udc2f\ud801\udc39\ud801\udc3b\ud801\udc2f\ud801\udc4b\ud801\udc3a\ud801\udc32\ud801\udc49",
      "\ud801\udc09\ud801\udc3f\ud801\udc3b\ud801\udc2c\ud801\udc3a\ud801\udc32\ud801\udc49",
      "\ud801\udc24\ud801\udc2c\ud801\udc42\ud801\udc2f\ud801\udc4b\ud801\udc3a\ud801\udc32\ud801\udc49",
      "\ud801\udc14\ud801\udc28\ud801\udc45\ud801\udc2f\ud801\udc4b\ud801\udc3a\ud801\udc32\ud801\udc49"
    ],
    "SHORTDAY": [
      "\ud801\udc1d\ud801\udc32\ud801\udc4c",
      "\ud801\udc23\ud801\udc32\ud801\udc4c",
      "\ud801\udc13\ud801\udc2d\ud801\udc46",
      "\ud801\udc0e\ud801\udc2f\ud801\udc4c",
      "\ud801\udc1b\ud801\udc32\ud801\udc49",
      "\ud801\udc19\ud801\udc49\ud801\udc34",
      "\ud801\udc1d\ud801\udc30\ud801\udc3b"
    ],
    "SHORTMONTH": [
      "\ud801\udc16\ud801\udc30\ud801\udc4c",
      "\ud801\udc19\ud801\udc2f\ud801\udc3a",
      "\ud801\udc23\ud801\udc2a\ud801\udc49",
      "\ud801\udc01\ud801\udc39\ud801\udc49",
      "\ud801\udc23\ud801\udc29",
      "\ud801\udc16\ud801\udc2d\ud801\udc4c",
      "\ud801\udc16\ud801\udc2d\ud801\udc4a",
      "\ud801\udc02\ud801\udc40",
      "\ud801\udc1d\ud801\udc2f\ud801\udc39",
      "\ud801\udc09\ud801\udc3f\ud801\udc3b",
      "\ud801\udc24\ud801\udc2c\ud801\udc42",
      "\ud801\udc14\ud801\udc28\ud801\udc45"
    ],
    "fullDate": "EEEE, MMMM d, y",
    "longDate": "MMMM d, y",
    "medium": "MMM d, y h:mm:ss a",
    "mediumDate": "MMM d, y",
    "mediumTime": "h:mm:ss a",
    "short": "M/d/yy h:mm a",
    "shortDate": "M/d/yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "$",
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
        "negPre": "(\u00a4",
        "negSuf": ")",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "en-dsrt",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);