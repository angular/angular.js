angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "f.h.",
      "1": "e.h."
    },
    "DAY": {
      "0": "sunnudagur",
      "1": "mánudagur",
      "2": "þriðjudagur",
      "3": "miðvikudagur",
      "4": "fimmtudagur",
      "5": "föstudagur",
      "6": "laugardagur"
    },
    "MONTH": {
      "0": "janúar",
      "1": "febrúar",
      "2": "mars",
      "3": "apríl",
      "4": "maí",
      "5": "júní",
      "6": "júlí",
      "7": "ágúst",
      "8": "september",
      "9": "október",
      "10": "nóvember",
      "11": "desember"
    },
    "SHORTDAY": {
      "0": "sun",
      "1": "mán",
      "2": "þri",
      "3": "mið",
      "4": "fim",
      "5": "fös",
      "6": "lau"
    },
    "SHORTMONTH": {
      "0": "jan",
      "1": "feb",
      "2": "mar",
      "3": "apr",
      "4": "maí",
      "5": "jún",
      "6": "júl",
      "7": "ágú",
      "8": "sep",
      "9": "okt",
      "10": "nóv",
      "11": "des"
    },
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "d.M.yyyy HH:mm:ss",
    "mediumDate": "d.M.yyyy",
    "mediumTime": "HH:mm:ss",
    "short": "d.M.yyyy HH:mm",
    "shortDate": "d.M.yyyy",
    "shortTime": "HH:mm"
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
        "negPre": "(\u00A4",
        "negSuf": ")",
        "posPre": "\u00A4",
        "posSuf": ""
      }
    }
  },
  "id": "is-is",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);