'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u0635",
      "\u0645"
    ],
    "DAY": [
      "\u0627\u0644\u0623\u062d\u062f",
      "\u0627\u0644\u0627\u062b\u0646\u064a\u0646",
      "\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621",
      "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621",
      "\u0627\u0644\u062e\u0645\u064a\u0633",
      "\u0627\u0644\u062c\u0645\u0639\u0629",
      "\u0627\u0644\u0633\u0628\u062a"
    ],
    "ERANAMES": [
      "\u0642\u0628\u0644 \u0627\u0644\u0645\u064a\u0644\u0627\u062f",
      "\u0645\u064a\u0644\u0627\u062f\u064a"
    ],
    "ERAS": [
      "\u0642.\u0645",
      "\u0645"
    ],
    "FIRSTDAYOFWEEK": 5,
    "MONTH": [
      "\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u062b\u0627\u0646\u064a",
      "\u0634\u0628\u0627\u0637",
      "\u0622\u0630\u0627\u0631",
      "\u0646\u064a\u0633\u0627\u0646",
      "\u0623\u064a\u0627\u0631",
      "\u062d\u0632\u064a\u0631\u0627\u0646",
      "\u062a\u0645\u0648\u0632",
      "\u0622\u0628",
      "\u0623\u064a\u0644\u0648\u0644",
      "\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u0623\u0648\u0644",
      "\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u062b\u0627\u0646\u064a",
      "\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u0623\u0648\u0644"
    ],
    "SHORTDAY": [
      "\u0627\u0644\u0623\u062d\u062f",
      "\u0627\u0644\u0627\u062b\u0646\u064a\u0646",
      "\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621",
      "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621",
      "\u0627\u0644\u062e\u0645\u064a\u0633",
      "\u0627\u0644\u062c\u0645\u0639\u0629",
      "\u0627\u0644\u0633\u0628\u062a"
    ],
    "SHORTMONTH": [
      "\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u062b\u0627\u0646\u064a",
      "\u0634\u0628\u0627\u0637",
      "\u0622\u0630\u0627\u0631",
      "\u0646\u064a\u0633\u0627\u0646",
      "\u0623\u064a\u0627\u0631",
      "\u062d\u0632\u064a\u0631\u0627\u0646",
      "\u062a\u0645\u0648\u0632",
      "\u0622\u0628",
      "\u0623\u064a\u0644\u0648\u0644",
      "\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u0623\u0648\u0644",
      "\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u062b\u0627\u0646\u064a",
      "\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u0623\u0648\u0644"
    ],
    "STANDALONEMONTH": [
      "\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u062b\u0627\u0646\u064a",
      "\u0634\u0628\u0627\u0637",
      "\u0622\u0630\u0627\u0631",
      "\u0646\u064a\u0633\u0627\u0646",
      "\u0623\u064a\u0627\u0631",
      "\u062d\u0632\u064a\u0631\u0627\u0646",
      "\u062a\u0645\u0648\u0632",
      "\u0622\u0628",
      "\u0623\u064a\u0644\u0648\u0644",
      "\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u0623\u0648\u0644",
      "\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u062b\u0627\u0646\u064a",
      "\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u0623\u0648\u0644"
    ],
    "WEEKENDRANGE": [
      4,
      5
    ],
    "fullDate": "EEEE\u060c d MMMM\u060c y",
    "longDate": "d MMMM\u060c y",
    "medium": "dd\u200f/MM\u200f/y h:mm:ss a",
    "mediumDate": "dd\u200f/MM\u200f/y",
    "mediumTime": "h:mm:ss a",
    "short": "d\u200f/M\u200f/y h:mm a",
    "shortDate": "d\u200f/M\u200f/y",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u00a3",
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
  "id": "ar-sy",
  "pluralCat": function(n, opt_precision) {  if (n == 0) {    return PLURAL_CATEGORY.ZERO;  }  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  if (n == 2) {    return PLURAL_CATEGORY.TWO;  }  if (n % 100 >= 3 && n % 100 <= 10) {    return PLURAL_CATEGORY.FEW;  }  if (n % 100 >= 11 && n % 100 <= 99) {    return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
