angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "dop.",
      "1": "pop."
    },
    "DAY": {
      "0": "nedelja",
      "1": "ponedeljek",
      "2": "torek",
      "3": "sreda",
      "4": "\u010detrtek",
      "5": "petek",
      "6": "sobota"
    },
    "MONTH": {
      "0": "januar",
      "1": "februar",
      "2": "marec",
      "3": "april",
      "4": "maj",
      "5": "junij",
      "6": "julij",
      "7": "avgust",
      "8": "september",
      "9": "oktober",
      "10": "november",
      "11": "december"
    },
    "SHORTDAY": {
      "0": "ned.",
      "1": "pon.",
      "2": "tor.",
      "3": "sre.",
      "4": "\u010det.",
      "5": "pet.",
      "6": "sob."
    },
    "SHORTMONTH": {
      "0": "jan.",
      "1": "feb.",
      "2": "mar.",
      "3": "apr.",
      "4": "maj",
      "5": "jun.",
      "6": "jul.",
      "7": "avg.",
      "8": "sep.",
      "9": "okt.",
      "10": "nov.",
      "11": "dec."
    },
    "fullDate": "EEEE, dd. MMMM y",
    "longDate": "dd. MMMM y",
    "medium": "d. MMM yyyy HH:mm:ss",
    "mediumDate": "d. MMM yyyy",
    "mediumTime": "HH:mm:ss",
    "short": "d. MM. yy HH:mm",
    "shortDate": "d. MM. yy",
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
        "negPre": "(\u00a4",
        "negSuf": ")",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    }
  },
  "id": "sl",
  "pluralCat": function (n) {  if (n % 100 == 1) {   return PLURAL_CATEGORY.ONE;  }  if (n % 100 == 2) {   return PLURAL_CATEGORY.TWO;  }  if (n % 100 == 3 || n % 100 == 4) {   return PLURAL_CATEGORY.FEW;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);