angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "AM",
      "1": "PM"
    },
    "DAY": {
      "0": "duminic\u0103",
      "1": "luni",
      "2": "mar\u021bi",
      "3": "miercuri",
      "4": "joi",
      "5": "vineri",
      "6": "s\u00e2mb\u0103t\u0103"
    },
    "MONTH": {
      "0": "ianuarie",
      "1": "februarie",
      "2": "martie",
      "3": "aprilie",
      "4": "mai",
      "5": "iunie",
      "6": "iulie",
      "7": "august",
      "8": "septembrie",
      "9": "octombrie",
      "10": "noiembrie",
      "11": "decembrie"
    },
    "SHORTDAY": {
      "0": "Du",
      "1": "Lu",
      "2": "Ma",
      "3": "Mi",
      "4": "Jo",
      "5": "Vi",
      "6": "S\u00e2"
    },
    "SHORTMONTH": {
      "0": "ian.",
      "1": "feb.",
      "2": "mar.",
      "3": "apr.",
      "4": "mai",
      "5": "iun.",
      "6": "iul.",
      "7": "aug.",
      "8": "sept.",
      "9": "oct.",
      "10": "nov.",
      "11": "dec."
    },
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "dd.MM.yyyy HH:mm:ss",
    "mediumDate": "dd.MM.yyyy",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yyyy HH:mm",
    "shortDate": "dd.MM.yyyy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "RON",
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
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    }
  },
  "id": "ro",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  if (n == 0 || n != 1 && n == (n | 0) && n % 100 >= 1 && n % 100 <= 19) {   return PLURAL_CATEGORY.FEW;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);