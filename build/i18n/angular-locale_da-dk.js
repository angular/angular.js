angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "f.m.",
      "1": "e.m."
    },
    "DAY": {
      "0": "søndag",
      "1": "mandag",
      "2": "tirsdag",
      "3": "onsdag",
      "4": "torsdag",
      "5": "fredag",
      "6": "lørdag"
    },
    "MONTH": {
      "0": "januar",
      "1": "februar",
      "2": "marts",
      "3": "april",
      "4": "maj",
      "5": "juni",
      "6": "juli",
      "7": "august",
      "8": "september",
      "9": "oktober",
      "10": "november",
      "11": "december"
    },
    "SHORTDAY": {
      "0": "søn",
      "1": "man",
      "2": "tir",
      "3": "ons",
      "4": "tor",
      "5": "fre",
      "6": "lør"
    },
    "SHORTMONTH": {
      "0": "jan.",
      "1": "feb.",
      "2": "mar.",
      "3": "apr.",
      "4": "maj",
      "5": "jun.",
      "6": "jul.",
      "7": "aug.",
      "8": "sep.",
      "9": "okt.",
      "10": "nov.",
      "11": "dec."
    },
    "fullDate": "EEEE 'den' d. MMMM y",
    "longDate": "d. MMM y",
    "medium": "dd/MM/yyyy HH.mm.ss",
    "mediumDate": "dd/MM/yyyy",
    "mediumTime": "HH.mm.ss",
    "short": "dd/MM/yy HH.mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH.mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "kr",
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
        "negSuf": " \u00A4",
        "posPre": "",
        "posSuf": " \u00A4"
      }
    }
  },
  "id": "da-dk",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);