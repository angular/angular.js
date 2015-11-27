'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "de.",
      "du."
    ],
    "DAY": [
      "vas\u00e1rnap",
      "h\u00e9tf\u0151",
      "kedd",
      "szerda",
      "cs\u00fct\u00f6rt\u00f6k",
      "p\u00e9ntek",
      "szombat"
    ],
    "ERANAMES": [
      "id\u0151sz\u00e1m\u00edt\u00e1sunk el\u0151tt",
      "id\u0151sz\u00e1m\u00edt\u00e1sunk szerint"
    ],
    "ERAS": [
      "i. e.",
      "i. sz."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "janu\u00e1r",
      "febru\u00e1r",
      "m\u00e1rcius",
      "\u00e1prilis",
      "m\u00e1jus",
      "j\u00fanius",
      "j\u00falius",
      "augusztus",
      "szeptember",
      "okt\u00f3ber",
      "november",
      "december"
    ],
    "SHORTDAY": [
      "V",
      "H",
      "K",
      "Sze",
      "Cs",
      "P",
      "Szo"
    ],
    "SHORTMONTH": [
      "jan.",
      "febr.",
      "m\u00e1rc.",
      "\u00e1pr.",
      "m\u00e1j.",
      "j\u00fan.",
      "j\u00fal.",
      "aug.",
      "szept.",
      "okt.",
      "nov.",
      "dec."
    ],
    "STANDALONEMONTH": [
      "janu\u00e1r",
      "febru\u00e1r",
      "m\u00e1rcius",
      "\u00e1prilis",
      "m\u00e1jus",
      "j\u00fanius",
      "j\u00falius",
      "augusztus",
      "szeptember",
      "okt\u00f3ber",
      "november",
      "december"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "y. MMMM d., EEEE",
    "longDate": "y. MMMM d.",
    "medium": "y. MMM d. H:mm:ss",
    "mediumDate": "y. MMM d.",
    "mediumTime": "H:mm:ss",
    "short": "y. MM. dd. H:mm",
    "shortDate": "y. MM. dd.",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Ft",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": "\u00a0",
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
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "hu-hu",
  "pluralCat": function(n, opt_precision) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
