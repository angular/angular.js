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
      "\u0a10\u0a24.",
      "\u0a38\u0a4b\u0a2e.",
      "\u0a2e\u0a70\u0a17\u0a32.",
      "\u0a2c\u0a41\u0a27.",
      "\u0a35\u0a40\u0a30.",
      "\u0a38\u0a3c\u0a41\u0a71\u0a15\u0a30.",
      "\u0a38\u0a3c\u0a28\u0a40."
    ],
    "SHORTMONTH": [
      "\u0a1c\u0a28\u0a35\u0a30\u0a40",
      "\u0a2b\u0a3c\u0a30\u0a35\u0a30\u0a40",
      "\u0a2e\u0a3e\u0a30\u0a1a",
      "\u0a05\u0a2a\u0a4d\u0a30\u0a48\u0a32",
      "\u0a2e\u0a08",
      "\u0a1c\u0a42\u0a28",
      "\u0a1c\u0a41\u0a32\u0a3e\u0a08",
      "\u0a05\u0a17\u0a38\u0a24",
      "\u0a38\u0a24\u0a70\u0a2c\u0a30",
      "\u0a05\u0a15\u0a24\u0a42\u0a2c\u0a30",
      "\u0a28\u0a35\u0a70\u0a2c\u0a30",
      "\u0a26\u0a38\u0a70\u0a2c\u0a30"
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "pa-arab-pk",
  "pluralCat": function(n, opt_precision) {  if (n >= 0 && n <= 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
