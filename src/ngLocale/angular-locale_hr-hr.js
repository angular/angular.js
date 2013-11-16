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
      "nedjelja",
      "ponedjeljak",
      "utorak",
      "srijeda",
      "\u010detvrtak",
      "petak",
      "subota"
    ],
    "MONTH": [
      "sije\u010dnja",
      "velja\u010de",
      "o\u017eujka",
      "travnja",
      "svibnja",
      "lipnja",
      "srpnja",
      "kolovoza",
      "rujna",
      "listopada",
      "studenoga",
      "prosinca"
    ],
    "SHORTDAY": [
      "ned",
      "pon",
      "uto",
      "sri",
      "\u010det",
      "pet",
      "sub"
    ],
    "SHORTMONTH": [
      "sij",
      "velj",
      "o\u017eu",
      "tra",
      "svi",
      "lip",
      "srp",
      "kol",
      "ruj",
      "lis",
      "stu",
      "pro"
    ],
    "fullDate": "EEEE, d. MMMM y.",
    "longDate": "d. MMMM y.",
    "medium": "d. M. y. HH:mm:ss",
    "mediumDate": "d. M. y.",
    "mediumTime": "HH:mm:ss",
    "short": "d.M.y. HH:mm",
    "shortDate": "d.M.y.",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "kn",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
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
  "id": "hr-hr",
  "pluralCat": function (n) {  if (n % 10 == 1 && n % 100 != 11) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) {   return PLURAL_CATEGORY.FEW;  }  if (n % 10 == 0 || n == (n | 0) && n % 10 >= 5 && n % 10 <= 9 || n == (n | 0) && n % 100 >= 11 && n % 100 <= 14) {   return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);