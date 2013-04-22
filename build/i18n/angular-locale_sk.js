angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "dopoludnia",
      "1": "popoludn\u00ed"
    },
    "DAY": {
      "0": "nede\u013ea",
      "1": "pondelok",
      "2": "utorok",
      "3": "streda",
      "4": "\u0161tvrtok",
      "5": "piatok",
      "6": "sobota"
    },
    "MONTH": {
      "0": "janu\u00e1ra",
      "1": "febru\u00e1ra",
      "2": "marca",
      "3": "apr\u00edla",
      "4": "m\u00e1ja",
      "5": "j\u00fana",
      "6": "j\u00fala",
      "7": "augusta",
      "8": "septembra",
      "9": "okt\u00f3bra",
      "10": "novembra",
      "11": "decembra"
    },
    "SHORTDAY": {
      "0": "ne",
      "1": "po",
      "2": "ut",
      "3": "st",
      "4": "\u0161t",
      "5": "pi",
      "6": "so"
    },
    "SHORTMONTH": {
      "0": "jan",
      "1": "feb",
      "2": "mar",
      "3": "apr",
      "4": "m\u00e1j",
      "5": "j\u00fan",
      "6": "j\u00fal",
      "7": "aug",
      "8": "sep",
      "9": "okt",
      "10": "nov",
      "11": "dec"
    },
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "d.M.yyyy H:mm:ss",
    "mediumDate": "d.M.yyyy",
    "mediumTime": "H:mm:ss",
    "short": "d.M.yyyy H:mm",
    "shortDate": "d.M.yyyy",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
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
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    }
  },
  "id": "sk",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n >= 2 && n <= 4) {   return PLURAL_CATEGORY.FEW;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);