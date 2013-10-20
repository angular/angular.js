'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "dop.",
      "odp."
    ],
    "DAY": [
      "ned\u011ble",
      "pond\u011bl\u00ed",
      "\u00fater\u00fd",
      "st\u0159eda",
      "\u010dtvrtek",
      "p\u00e1tek",
      "sobota"
    ],
    "MONTH": [
      "ledna",
      "\u00fanora",
      "b\u0159ezna",
      "dubna",
      "kv\u011btna",
      "\u010dervna",
      "\u010dervence",
      "srpna",
      "z\u00e1\u0159\u00ed",
      "\u0159\u00edjna",
      "listopadu",
      "prosince"
    ],
    "SHORTDAY": [
      "ne",
      "po",
      "\u00fat",
      "st",
      "\u010dt",
      "p\u00e1",
      "so"
    ],
    "SHORTMONTH": [
      "Led",
      "\u00dano",
      "B\u0159e",
      "Dub",
      "Kv\u011b",
      "\u010cer",
      "\u010cvc",
      "Srp",
      "Z\u00e1\u0159",
      "\u0158\u00edj",
      "Lis",
      "Pro"
    ],
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "d. M. yyyy H:mm:ss",
    "mediumDate": "d. M. yyyy",
    "mediumTime": "H:mm:ss",
    "short": "dd.MM.yy H:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "K\u010d",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": "\u00a0",
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
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "cs-cz",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n >= 2 && n <= 4) {   return PLURAL_CATEGORY.FEW;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);