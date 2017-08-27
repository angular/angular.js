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
    "ERANAMES": [
      "Tr\u01b0\u1edbc CN",
      "sau CN"
    ],
    "ERAS": [
      "Tr\u01b0\u1edbc CN",
      "sau CN"
    ],
    "FIRSTDAYOFWEEK": 0,
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
    "STANDALONEMONTH": [
      "Th\u00e1ng 1",
      "Th\u00e1ng 2",
      "Th\u00e1ng 3",
      "Th\u00e1ng 4",
      "Th\u00e1ng 5",
      "Th\u00e1ng 6",
      "Th\u00e1ng 7",
      "Th\u00e1ng 8",
      "Th\u00e1ng 9",
      "Th\u00e1ng 10",
      "Th\u00e1ng 11",
      "Th\u00e1ng 12"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "d MMM, y HH:mm:ss",
    "mediumDate": "d MMM, y",
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
  "id": "vi-vn",
  "localeID": "vi_VN",
  "pluralCat": function(n, opt_precision) {  return PLURAL_CATEGORY.OTHER;}
});
}]);
