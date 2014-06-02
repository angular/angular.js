'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "SA",
      "CH"
    ],
    "DAY": [
      "Ch\u1ee7 Nh\u1eadt",
      "Th\u1ee9 Hai",
      "Th\u1ee9 Ba",
      "Th\u1ee9 T\u01b0",
      "Th\u1ee9 N\u0103m",
      "Th\u1ee9 S\u00e1u",
      "Th\u1ee9 B\u1ea3y"
    ],
    "MONTH": [
      "th\u00e1ng 1",
      "th\u00e1ng 2",
      "th\u00e1ng 3",
      "th\u00e1ng 4",
      "th\u00e1ng 5",
      "th\u00e1ng 6",
      "th\u00e1ng 7",
      "th\u00e1ng 8",
      "th\u00e1ng 9",
      "th\u00e1ng 10",
      "th\u00e1ng 11",
      "th\u00e1ng 12"
    ],
    "SHORTDAY": [
      "CN",
      "Th 2",
      "Th 3",
      "Th 4",
      "Th 5",
      "Th 6",
      "Th 7"
    ],
    "SHORTMONTH": [
      "thg 1",
      "thg 2",
      "thg 3",
      "thg 4",
      "thg 5",
      "thg 6",
      "thg 7",
      "thg 8",
      "thg 9",
      "thg 10",
      "thg 11",
      "thg 12"
    ],
    "fullDate": "EEEE, 'ng\u00e0y' dd MMMM 'n\u0103m' y",
    "longDate": "'Ng\u00e0y' dd 'th\u00e1ng' MM 'n\u0103m' y",
    "medium": "dd-MM-y HH:mm:ss",
    "mediumDate": "dd-MM-y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/y HH:mm",
    "shortDate": "dd/MM/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ab",
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
  "id": "vi-vn",
  "pluralCat": function (n, opt_precision) {  return PLURAL_CATEGORY.OTHER;}
});
}]);