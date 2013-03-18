angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "ntɔ́ngɔ́",
      "1": "mpókwa"
    },
    "DAY": {
      "0": "eyenga",
      "1": "mokɔlɔ mwa yambo",
      "2": "mokɔlɔ mwa míbalé",
      "3": "mokɔlɔ mwa mísáto",
      "4": "mokɔlɔ ya mínéi",
      "5": "mokɔlɔ ya mítáno",
      "6": "mpɔ́sɔ"
    },
    "MONTH": {
      "0": "sánzá ya yambo",
      "1": "sánzá ya míbalé",
      "2": "sánzá ya mísáto",
      "3": "sánzá ya mínei",
      "4": "sánzá ya mítáno",
      "5": "sánzá ya motóbá",
      "6": "sánzá ya nsambo",
      "7": "sánzá ya mwambe",
      "8": "sánzá ya libwa",
      "9": "sánzá ya zómi",
      "10": "sánzá ya zómi na mɔ̌kɔ́",
      "11": "sánzá ya zómi na míbalé"
    },
    "SHORTDAY": {
      "0": "eye",
      "1": "ybo",
      "2": "mbl",
      "3": "mst",
      "4": "min",
      "5": "mtn",
      "6": "mps"
    },
    "SHORTMONTH": {
      "0": "yan",
      "1": "fbl",
      "2": "msi",
      "3": "apl",
      "4": "mai",
      "5": "yun",
      "6": "yul",
      "7": "agt",
      "8": "stb",
      "9": "ɔtb",
      "10": "nvb",
      "11": "dsb"
    },
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/yyyy HH:mm",
    "shortDate": "d/M/yyyy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "FrCD",
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
  "id": "ln-cg",
  "pluralCat": function (n) {  if (n == 0 || n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);