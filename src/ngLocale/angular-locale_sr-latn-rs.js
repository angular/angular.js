angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "pre podne",
      "1": "popodne"
    },
    "DAY": {
      "0": "nedelja",
      "1": "ponedeljak",
      "2": "utorak",
      "3": "sreda",
      "4": "četvrtak",
      "5": "petak",
      "6": "subota"
    },
    "MONTH": {
      "0": "januar",
      "1": "februar",
      "2": "mart",
      "3": "april",
      "4": "maj",
      "5": "jun",
      "6": "jul",
      "7": "avgust",
      "8": "septembar",
      "9": "oktobar",
      "10": "novembar",
      "11": "decembar"
    },
    "SHORTDAY": {
      "0": "ned",
      "1": "pon",
      "2": "uto",
      "3": "sre",
      "4": "čet",
      "5": "pet",
      "6": "sub"
    },
    "SHORTMONTH": {
      "0": "jan",
      "1": "feb",
      "2": "mar",
      "3": "apr",
      "4": "maj",
      "5": "jun",
      "6": "jul",
      "7": "avg",
      "8": "sep",
      "9": "okt",
      "10": "nov",
      "11": "dec"
    },
    "fullDate": "EEEE, dd. MMMM y.",
    "longDate": "dd. MMMM y.",
    "medium": "dd.MM.y. HH.mm.ss",
    "mediumDate": "dd.MM.y.",
    "mediumTime": "HH.mm.ss",
    "short": "d.M.yy. HH.mm",
    "shortDate": "d.M.yy.",
    "shortTime": "HH.mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "din",
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
  "id": "sr-latn-rs",
  "pluralCat": function (n) {  if (n % 10 == 1 && n % 100 != 11) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) {   return PLURAL_CATEGORY.FEW;  }  if (n % 10 == 0 || n == (n | 0) && n % 10 >= 5 && n % 10 <= 9 || n == (n | 0) && n % 100 >= 11 && n % 100 <= 14) {   return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);