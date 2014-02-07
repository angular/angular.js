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
      "duminic\u0103",
      "luni",
      "mar\u021bi",
      "miercuri",
      "joi",
      "vineri",
      "s\u00e2mb\u0103t\u0103"
    ],
    "MONTH": [
      "ianuarie",
      "februarie",
      "martie",
      "aprilie",
      "mai",
      "iunie",
      "iulie",
      "august",
      "septembrie",
      "octombrie",
      "noiembrie",
      "decembrie"
    ],
    "SHORTDAY": [
      "Dum",
      "Lun",
      "Mar",
      "Mie",
      "Joi",
      "Vin",
      "S\u00e2m"
    ],
    "SHORTMONTH": [
      "ian.",
      "feb.",
      "mar.",
      "apr.",
      "mai",
      "iun.",
      "iul.",
      "aug.",
      "sept.",
      "oct.",
      "nov.",
      "dec."
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.y HH:mm",
    "shortDate": "dd.MM.y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "RON",
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
  "id": "ro-ro",
  "pluralCat": function (n, opt_precision) {  var i = n | 0;  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  if (vf.v != 0 || n == 0 || n != 1 && n % 100 >= 1 && n % 100 <= 19) {    return PLURAL_CATEGORY.FEW;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);