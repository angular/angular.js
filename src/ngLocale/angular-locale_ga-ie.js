'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "a.m.",
      "p.m."
    ],
    "DAY": [
      "D\u00e9 Domhnaigh",
      "D\u00e9 Luain",
      "D\u00e9 M\u00e1irt",
      "D\u00e9 C\u00e9adaoin",
      "D\u00e9ardaoin",
      "D\u00e9 hAoine",
      "D\u00e9 Sathairn"
    ],
    "ERANAMES": [
      "Roimh Chr\u00edost",
      "Anno Domini"
    ],
    "ERAS": [
      "RC",
      "AD"
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "Ean\u00e1ir",
      "Feabhra",
      "M\u00e1rta",
      "Aibre\u00e1n",
      "Bealtaine",
      "Meitheamh",
      "I\u00fail",
      "L\u00fanasa",
      "Me\u00e1n F\u00f3mhair",
      "Deireadh F\u00f3mhair",
      "Samhain",
      "Nollaig"
    ],
    "SHORTDAY": [
      "Domh",
      "Luan",
      "M\u00e1irt",
      "C\u00e9ad",
      "D\u00e9ar",
      "Aoine",
      "Sath"
    ],
    "SHORTMONTH": [
      "Ean",
      "Feabh",
      "M\u00e1rta",
      "Aib",
      "Beal",
      "Meith",
      "I\u00fail",
      "L\u00fan",
      "MF\u00f3mh",
      "DF\u00f3mh",
      "Samh",
      "Noll"
    ],
    "STANDALONEMONTH": [
      "Ean\u00e1ir",
      "Feabhra",
      "M\u00e1rta",
      "Aibre\u00e1n",
      "Bealtaine",
      "Meitheamh",
      "I\u00fail",
      "L\u00fanasa",
      "Me\u00e1n F\u00f3mhair",
      "Deireadh F\u00f3mhair",
      "Samhain",
      "Nollaig"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
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
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "ga-ie",
  "pluralCat": function(n, opt_precision) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  if (n == 2) {    return PLURAL_CATEGORY.TWO;  }  if (n >= 3 && n <= 6) {    return PLURAL_CATEGORY.FEW;  }  if (n >= 7 && n <= 10) {    return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
