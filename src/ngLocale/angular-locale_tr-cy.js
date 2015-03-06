'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u00d6\u00d6",
      "\u00d6S"
    ],
    "DAY": [
      "Pazar",
      "Pazartesi",
      "Sal\u0131",
      "\u00c7ar\u015famba",
      "Per\u015fembe",
      "Cuma",
      "Cumartesi"
    ],
    "ERANAMES": [
      "Milattan \u00d6nce",
      "Milattan Sonra"
    ],
    "ERAS": [
      "M\u00d6",
      "MS"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Ocak",
      "\u015eubat",
      "Mart",
      "Nisan",
      "May\u0131s",
      "Haziran",
      "Temmuz",
      "A\u011fustos",
      "Eyl\u00fcl",
      "Ekim",
      "Kas\u0131m",
      "Aral\u0131k"
    ],
    "SHORTDAY": [
      "Paz",
      "Pzt",
      "Sal",
      "\u00c7ar",
      "Per",
      "Cum",
      "Cmt"
    ],
    "SHORTMONTH": [
      "Oca",
      "\u015eub",
      "Mar",
      "Nis",
      "May",
      "Haz",
      "Tem",
      "A\u011fu",
      "Eyl",
      "Eki",
      "Kas",
      "Ara"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "d MMMM y EEEE",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "d MM y HH:mm",
    "shortDate": "d MM y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
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
  "id": "tr-cy",
  "pluralCat": function(n, opt_precision) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
