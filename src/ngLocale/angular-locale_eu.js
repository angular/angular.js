angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "AM",
      "1": "PM"
    },
    "DAY": {
      "0": "igandea",
      "1": "astelehena",
      "2": "asteartea",
      "3": "asteazkena",
      "4": "osteguna",
      "5": "ostirala",
      "6": "larunbata"
    },
    "MONTH": {
      "0": "urtarrila",
      "1": "otsaila",
      "2": "martxoa",
      "3": "apirila",
      "4": "maiatza",
      "5": "ekaina",
      "6": "uztaila",
      "7": "abuztua",
      "8": "iraila",
      "9": "urria",
      "10": "azaroa",
      "11": "abendua"
    },
    "SHORTDAY": {
      "0": "ig",
      "1": "al",
      "2": "as",
      "3": "az",
      "4": "og",
      "5": "or",
      "6": "lr"
    },
    "SHORTMONTH": {
      "0": "urt",
      "1": "ots",
      "2": "mar",
      "3": "api",
      "4": "mai",
      "5": "eka",
      "6": "uzt",
      "7": "abu",
      "8": "ira",
      "9": "urr",
      "10": "aza",
      "11": "abe"
    },
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
    "PATTERNS": {
      "0": {
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
      "1": {
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
    }
  },
  "id": "eu",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);