'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "a. m.",
      "p. m."
    ],
    "DAY": [
      "diumenge",
      "dilluns",
      "dimarts",
      "dimecres",
      "dijous",
      "divendres",
      "dissabte"
    ],
    "MONTH": [
      "gener",
      "febrer",
      "mar\u00e7",
      "abril",
      "maig",
      "juny",
      "juliol",
      "agost",
      "setembre",
      "octubre",
      "novembre",
      "desembre"
    ],
    "SHORTDAY": [
      "dg.",
      "dl.",
      "dt.",
      "dc.",
      "dj.",
      "dv.",
      "ds."
    ],
    "SHORTMONTH": [
      "gen.",
      "feb.",
      "mar\u00e7",
      "abr.",
      "maig",
      "juny",
      "jul.",
      "ag.",
      "set.",
      "oct.",
      "nov.",
      "des."
    ],
    "fullDate": "EEEE, d MMMM 'de' y",
    "longDate": "d MMMM 'de' y",
    "medium": "dd/MM/y H.mm.ss",
    "mediumDate": "dd/MM/y",
    "mediumTime": "H.mm.ss",
    "short": "d/M/yy H.mm",
    "shortDate": "d/M/yy",
    "shortTime": "H.mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
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
  "id": "ca-it",
  "pluralCat": function (n, opt_precision) {  var i = n | 0;  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);