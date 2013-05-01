angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "a.m.",
      "1": "p.m."
    },
    "DAY": {
      "0": "diumenge",
      "1": "dilluns",
      "2": "dimarts",
      "3": "dimecres",
      "4": "dijous",
      "5": "divendres",
      "6": "dissabte"
    },
    "MONTH": {
      "0": "de gener",
      "1": "de febrer",
      "2": "de mar\u00e7",
      "3": "d\u2019abril",
      "4": "de maig",
      "5": "de juny",
      "6": "de juliol",
      "7": "d\u2019agost",
      "8": "de setembre",
      "9": "d\u2019octubre",
      "10": "de novembre",
      "11": "de desembre"
    },
    "SHORTDAY": {
      "0": "dg.",
      "1": "dl.",
      "2": "dt.",
      "3": "dc.",
      "4": "dj.",
      "5": "dv.",
      "6": "ds."
    },
    "SHORTMONTH": {
      "0": "de gen.",
      "1": "de febr.",
      "2": "de mar\u00e7",
      "3": "d\u2019abr.",
      "4": "de maig",
      "5": "de juny",
      "6": "de jul.",
      "7": "d\u2019ag.",
      "8": "de set.",
      "9": "d\u2019oct.",
      "10": "de nov.",
      "11": "de des."
    },
    "fullDate": "EEEE d MMMM 'de' y",
    "longDate": "d MMMM 'de' y",
    "medium": "dd/MM/yyyy H:mm:ss",
    "mediumDate": "dd/MM/yyyy",
    "mediumTime": "H:mm:ss",
    "short": "dd/MM/yy H:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "H:mm"
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
  "id": "ca-ad",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);