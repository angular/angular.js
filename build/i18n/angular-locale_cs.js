angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "dop.",
      "1": "odp."
    },
    "DAY": {
      "0": "neděle",
      "1": "pondělí",
      "2": "úterý",
      "3": "středa",
      "4": "čtvrtek",
      "5": "pátek",
      "6": "sobota"
    },
    "MONTH": {
      "0": "ledna",
      "1": "února",
      "2": "března",
      "3": "dubna",
      "4": "května",
      "5": "června",
      "6": "července",
      "7": "srpna",
      "8": "září",
      "9": "října",
      "10": "listopadu",
      "11": "prosince"
    },
    "SHORTDAY": {
      "0": "ne",
      "1": "po",
      "2": "út",
      "3": "st",
      "4": "čt",
      "5": "pá",
      "6": "so"
    },
    "SHORTMONTH": {
      "0": "Led",
      "1": "Úno",
      "2": "Bře",
      "3": "Dub",
      "4": "Kvě",
      "5": "Čer",
      "6": "Čvc",
      "7": "Srp",
      "8": "Zář",
      "9": "Říj",
      "10": "Lis",
      "11": "Pro"
    },
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "d. M. yyyy H:mm:ss",
    "mediumDate": "d. M. yyyy",
    "mediumTime": "H:mm:ss",
    "short": "dd.MM.yy H:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Kč",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": " ",
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
  "id": "cs",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n >= 2 && n <= 4) {   return PLURAL_CATEGORY.FEW;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);