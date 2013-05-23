angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "de.",
      "1": "du."
    },
    "DAY": {
      "0": "vas\u00e1rnap",
      "1": "h\u00e9tf\u0151",
      "2": "kedd",
      "3": "szerda",
      "4": "cs\u00fct\u00f6rt\u00f6k",
      "5": "p\u00e9ntek",
      "6": "szombat"
    },
    "MONTH": {
      "0": "janu\u00e1r",
      "1": "febru\u00e1r",
      "2": "m\u00e1rcius",
      "3": "\u00e1prilis",
      "4": "m\u00e1jus",
      "5": "j\u00fanius",
      "6": "j\u00falius",
      "7": "augusztus",
      "8": "szeptember",
      "9": "okt\u00f3ber",
      "10": "november",
      "11": "december"
    },
    "SHORTDAY": {
      "0": "V",
      "1": "H",
      "2": "K",
      "3": "Sze",
      "4": "Cs",
      "5": "P",
      "6": "Szo"
    },
    "SHORTMONTH": {
      "0": "jan.",
      "1": "febr.",
      "2": "m\u00e1rc.",
      "3": "\u00e1pr.",
      "4": "m\u00e1j.",
      "5": "j\u00fan.",
      "6": "j\u00fal.",
      "7": "aug.",
      "8": "szept.",
      "9": "okt.",
      "10": "nov.",
      "11": "dec."
    },
    "fullDate": "y. MMMM d., EEEE",
    "longDate": "y. MMMM d.",
    "medium": "yyyy.MM.dd. H:mm:ss",
    "mediumDate": "yyyy.MM.dd.",
    "mediumTime": "H:mm:ss",
    "short": "yyyy.MM.dd. H:mm",
    "shortDate": "yyyy.MM.dd.",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Ft",
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
  "id": "hu-hu",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);