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
      "igandea",
      "astelehena",
      "asteartea",
      "asteazkena",
      "osteguna",
      "ostirala",
      "larunbata"
    ],
    "MONTH": [
      "urtarrila",
      "otsaila",
      "martxoa",
      "apirila",
      "maiatza",
      "ekaina",
      "uztaila",
      "abuztua",
      "iraila",
      "urria",
      "azaroa",
      "abendua"
    ],
    "SHORTDAY": [
      "ig",
      "al",
      "as",
      "az",
      "og",
      "or",
      "lr"
    ],
    "SHORTMONTH": [
      "urt",
      "ots",
      "mar",
      "api",
      "mai",
      "eka",
      "uzt",
      "abu",
      "ira",
      "urr",
      "aza",
      "abe"
    ],
    "fullDate": "EEEE, y'eko' MMMM'ren' dd'a'",
    "longDate": "y'eko' MMM'ren' dd'a'",
    "medium": "y MMM d HH:mm:ss",
    "mediumDate": "y MMM d",
    "mediumTime": "HH:mm:ss",
    "short": "yyyy-MM-dd HH:mm",
    "shortDate": "yyyy-MM-dd",
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
        "negPre": "(",
        "negSuf": "\u00a0\u00a4)",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "eu-es",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);