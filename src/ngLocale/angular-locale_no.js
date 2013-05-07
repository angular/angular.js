angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "AM",
      "1": "PM"
    },
    "DAY": {
      "0": "s\u00f8ndag",
      "1": "mandag",
      "2": "tirsdag",
      "3": "onsdag",
      "4": "torsdag",
      "5": "fredag",
      "6": "l\u00f8rdag"
    },
    "MONTH": {
      "0": "januar",
      "1": "februar",
      "2": "mars",
      "3": "april",
      "4": "mai",
      "5": "juni",
      "6": "juli",
      "7": "august",
      "8": "september",
      "9": "oktober",
      "10": "november",
      "11": "desember"
    },
    "SHORTDAY": {
      "0": "s\u00f8n.",
      "1": "man.",
      "2": "tir.",
      "3": "ons.",
      "4": "tor.",
      "5": "fre.",
      "6": "l\u00f8r."
    },
    "SHORTMONTH": {
      "0": "jan.",
      "1": "feb.",
      "2": "mars",
      "3": "apr.",
      "4": "mai",
      "5": "juni",
      "6": "juli",
      "7": "aug.",
      "8": "sep.",
      "9": "okt.",
      "10": "nov.",
      "11": "des."
    },
    "fullDate": "EEEE d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "d. MMM y HH:mm:ss",
    "mediumDate": "d. MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "kr",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": "\u00a0",
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
        "negPre": "\u00a4\u00a0-",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    }
  },
  "id": "no",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);