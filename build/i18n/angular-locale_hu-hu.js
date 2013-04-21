angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "de.",
      "1": "du."
    },
    "DAY": {
      "0": "vasárnap",
      "1": "hétfő",
      "2": "kedd",
      "3": "szerda",
      "4": "csütörtök",
      "5": "péntek",
      "6": "szombat"
    },
    "MONTH": {
      "0": "január",
      "1": "február",
      "2": "március",
      "3": "április",
      "4": "május",
      "5": "június",
      "6": "július",
      "7": "augusztus",
      "8": "szeptember",
      "9": "október",
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
      "2": "márc.",
      "3": "ápr.",
      "4": "máj.",
      "5": "jún.",
      "6": "júl.",
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
  "id": "hu-hu",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);