'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "QN",
      "WN"
    ],
    "DAY": [
      "Il-\u0126add",
      "It-Tnejn",
      "It-Tlieta",
      "L-Erbg\u0127a",
      "Il-\u0126amis",
      "Il-\u0120img\u0127a",
      "Is-Sibt"
    ],
    "MONTH": [
      "Jannar",
      "Frar",
      "Marzu",
      "April",
      "Mejju",
      "\u0120unju",
      "Lulju",
      "Awwissu",
      "Settembru",
      "Ottubru",
      "Novembru",
      "Di\u010bembru"
    ],
    "SHORTDAY": [
      "\u0126ad",
      "Tne",
      "Tli",
      "Erb",
      "\u0126am",
      "\u0120im",
      "Sib"
    ],
    "SHORTMONTH": [
      "Jan",
      "Fra",
      "Mar",
      "Apr",
      "Mej",
      "\u0120un",
      "Lul",
      "Aww",
      "Set",
      "Ott",
      "Nov",
      "Di\u010b"
    ],
    "fullDate": "EEEE, d 'ta'\u2019 MMMM y",
    "longDate": "d 'ta'\u2019 MMMM y",
    "medium": "dd MMM y HH:mm:ss",
    "mediumDate": "dd MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/y HH:mm",
    "shortDate": "dd/MM/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "mt-mt",
  "pluralCat": function(n, opt_precision) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  if (n == 0 || n % 100 >= 2 && n % 100 <= 10) {    return PLURAL_CATEGORY.FEW;  }  if (n % 100 >= 11 && n % 100 <= 19) {    return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
