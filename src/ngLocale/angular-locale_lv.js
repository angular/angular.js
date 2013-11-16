'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "priek\u0161pusdien\u0101",
      "p\u0113cpusdien\u0101"
    ],
    "DAY": [
      "sv\u0113tdiena",
      "pirmdiena",
      "otrdiena",
      "tre\u0161diena",
      "ceturtdiena",
      "piektdiena",
      "sestdiena"
    ],
    "MONTH": [
      "janv\u0101ris",
      "febru\u0101ris",
      "marts",
      "apr\u012blis",
      "maijs",
      "j\u016bnijs",
      "j\u016blijs",
      "augusts",
      "septembris",
      "oktobris",
      "novembris",
      "decembris"
    ],
    "SHORTDAY": [
      "Sv",
      "Pr",
      "Ot",
      "Tr",
      "Ce",
      "Pk",
      "Se"
    ],
    "SHORTMONTH": [
      "janv.",
      "febr.",
      "marts",
      "apr.",
      "maijs",
      "j\u016bn.",
      "j\u016bl.",
      "aug.",
      "sept.",
      "okt.",
      "nov.",
      "dec."
    ],
    "fullDate": "EEEE, y. 'gada' d. MMMM",
    "longDate": "y. 'gada' d. MMMM",
    "medium": "y. 'gada' d. MMM HH:mm:ss",
    "mediumDate": "y. 'gada' d. MMM",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Ls",
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
        "negPre": "(\u00a4",
        "negSuf": ")",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "lv",
  "pluralCat": function (n) {  if (n == 0) {   return PLURAL_CATEGORY.ZERO;  }  if (n % 10 == 1 && n % 100 != 11) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);