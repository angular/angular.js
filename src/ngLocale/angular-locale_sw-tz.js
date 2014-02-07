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
      "Jumapili",
      "Jumatatu",
      "Jumanne",
      "Jumatano",
      "Alhamisi",
      "Ijumaa",
      "Jumamosi"
    ],
    "MONTH": [
      "Januari",
      "Februari",
      "Machi",
      "Aprili",
      "Mei",
      "Juni",
      "Julai",
      "Agosti",
      "Septemba",
      "Oktoba",
      "Novemba",
      "Desemba"
    ],
    "SHORTDAY": [
      "J2",
      "J3",
      "J4",
      "J5",
      "Alh",
      "Ij",
      "J1"
    ],
    "SHORTMONTH": [
      "Jan",
      "Feb",
      "Mac",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Okt",
      "Nov",
      "Des"
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "dd/MM/y h:mm a",
    "shortDate": "dd/MM/y",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "TSh",
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "sw-tz",
  "pluralCat": function (n, opt_precision) {  var i = n | 0;  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);