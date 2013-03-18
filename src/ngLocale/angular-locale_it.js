angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "m.",
      "1": "p."
    },
    "DAY": {
      "0": "domenica",
      "1": "lunedì",
      "2": "martedì",
      "3": "mercoledì",
      "4": "giovedì",
      "5": "venerdì",
      "6": "sabato"
    },
    "MONTH": {
      "0": "gennaio",
      "1": "febbraio",
      "2": "marzo",
      "3": "aprile",
      "4": "maggio",
      "5": "giugno",
      "6": "luglio",
      "7": "agosto",
      "8": "settembre",
      "9": "ottobre",
      "10": "novembre",
      "11": "dicembre"
    },
    "SHORTDAY": {
      "0": "dom",
      "1": "lun",
      "2": "mar",
      "3": "mer",
      "4": "gio",
      "5": "ven",
      "6": "sab"
    },
    "SHORTMONTH": {
      "0": "gen",
      "1": "feb",
      "2": "mar",
      "3": "apr",
      "4": "mag",
      "5": "giu",
      "6": "lug",
      "7": "ago",
      "8": "set",
      "9": "ott",
      "10": "nov",
      "11": "dic"
    },
    "fullDate": "EEEE d MMMM y",
    "longDate": "dd MMMM y",
    "medium": "dd/MMM/y HH:mm:ss",
    "mediumDate": "dd/MMM/y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "€",
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
        "negPre": "\u00A4 -",
        "negSuf": "",
        "posPre": "\u00A4 ",
        "posSuf": ""
      }
    }
  },
  "id": "it",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);