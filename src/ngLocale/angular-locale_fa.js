'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u0642\u0628\u0644\u200c\u0627\u0632\u0638\u0647\u0631",
      "\u0628\u0639\u062f\u0627\u0632\u0638\u0647\u0631"
    ],
    "DAY": [
      "\u06cc\u06a9\u0634\u0646\u0628\u0647",
      "\u062f\u0648\u0634\u0646\u0628\u0647",
      "\u0633\u0647\u200c\u0634\u0646\u0628\u0647",
      "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647",
      "\u067e\u0646\u062c\u0634\u0646\u0628\u0647",
      "\u062c\u0645\u0639\u0647",
      "\u0634\u0646\u0628\u0647"
    ],
    "ERANAMES": [
      "\u0642\u0628\u0644 \u0627\u0632 \u0645\u06cc\u0644\u0627\u062f",
      "\u0645\u06cc\u0644\u0627\u062f\u06cc"
    ],
    "ERAS": [
      "\u0642.\u0645.",
      "\u0645."
    ],
    "FIRSTDAYOFWEEK": 5,
    "MONTH": [
      "\u0698\u0627\u0646\u0648\u06cc\u0647\u0654",
      "\u0641\u0648\u0631\u06cc\u0647\u0654",
      "\u0645\u0627\u0631\u0633",
      "\u0622\u0648\u0631\u06cc\u0644",
      "\u0645\u0647\u0654",
      "\u0698\u0648\u0626\u0646",
      "\u0698\u0648\u0626\u06cc\u0647\u0654",
      "\u0627\u0648\u062a",
      "\u0633\u067e\u062a\u0627\u0645\u0628\u0631",
      "\u0627\u06a9\u062a\u0628\u0631",
      "\u0646\u0648\u0627\u0645\u0628\u0631",
      "\u062f\u0633\u0627\u0645\u0628\u0631"
    ],
    "SHORTDAY": [
      "\u06cc\u06a9\u0634\u0646\u0628\u0647",
      "\u062f\u0648\u0634\u0646\u0628\u0647",
      "\u0633\u0647\u200c\u0634\u0646\u0628\u0647",
      "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647",
      "\u067e\u0646\u062c\u0634\u0646\u0628\u0647",
      "\u062c\u0645\u0639\u0647",
      "\u0634\u0646\u0628\u0647"
    ],
    "SHORTMONTH": [
      "\u0698\u0627\u0646\u0648\u06cc\u0647\u0654",
      "\u0641\u0648\u0631\u06cc\u0647\u0654",
      "\u0645\u0627\u0631\u0633",
      "\u0622\u0648\u0631\u06cc\u0644",
      "\u0645\u0647\u0654",
      "\u0698\u0648\u0626\u0646",
      "\u0698\u0648\u0626\u06cc\u0647\u0654",
      "\u0627\u0648\u062a",
      "\u0633\u067e\u062a\u0627\u0645\u0628\u0631",
      "\u0627\u06a9\u062a\u0628\u0631",
      "\u0646\u0648\u0627\u0645\u0628\u0631",
      "\u062f\u0633\u0627\u0645\u0628\u0631"
    ],
    "STANDALONEMONTH": [
      "\u0698\u0627\u0646\u0648\u06cc\u0647",
      "\u0641\u0648\u0631\u06cc\u0647",
      "\u0645\u0627\u0631\u0633",
      "\u0622\u0648\u0631\u06cc\u0644",
      "\u0645\u0647",
      "\u0698\u0648\u0626\u0646",
      "\u0698\u0648\u0626\u06cc\u0647",
      "\u0627\u0648\u062a",
      "\u0633\u067e\u062a\u0627\u0645\u0628\u0631",
      "\u0627\u06a9\u062a\u0628\u0631",
      "\u0646\u0648\u0627\u0645\u0628\u0631",
      "\u062f\u0633\u0627\u0645\u0628\u0631"
    ],
    "WEEKENDRANGE": [
      4,
      4
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y H:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "H:mm:ss",
    "short": "y/M/d H:mm",
    "shortDate": "y/M/d",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Rial",
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
        "negPre": "\u061c-",
        "negSuf": "\u00a0\u061c\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u061c\u00a4"
      }
    ]
  },
  "id": "fa",
  "localeID": "fa",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  if (i == 0 || n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
