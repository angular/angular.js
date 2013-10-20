'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "enne keskp\u00e4eva",
      "p\u00e4rast keskp\u00e4eva"
    ],
    "DAY": [
      "p\u00fchap\u00e4ev",
      "esmasp\u00e4ev",
      "teisip\u00e4ev",
      "kolmap\u00e4ev",
      "neljap\u00e4ev",
      "reede",
      "laup\u00e4ev"
    ],
    "MONTH": [
      "jaanuar",
      "veebruar",
      "m\u00e4rts",
      "aprill",
      "mai",
      "juuni",
      "juuli",
      "august",
      "september",
      "oktoober",
      "november",
      "detsember"
    ],
    "SHORTDAY": [
      "P",
      "E",
      "T",
      "K",
      "N",
      "R",
      "L"
    ],
    "SHORTMONTH": [
      "jaan",
      "veebr",
      "m\u00e4rts",
      "apr",
      "mai",
      "juuni",
      "juuli",
      "aug",
      "sept",
      "okt",
      "nov",
      "dets"
    ],
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "dd.MM.yyyy H:mm.ss",
    "mediumDate": "dd.MM.yyyy",
    "mediumTime": "H:mm.ss",
    "short": "dd.MM.yy H:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
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
        "gSize": 0,
        "lgSize": 0,
        "macFrac": 0,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "(",
        "negSuf": "\u00a4)",
        "posPre": "",
        "posSuf": "\u00a4"
      }
    ]
  },
  "id": "et-ee",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);