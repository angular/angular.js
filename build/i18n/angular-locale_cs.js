angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "dop.",
      "1": "odp."
    },
    "DAY": {
      "0": "ned\u011ble",
      "1": "pond\u011bl\u00ed",
      "2": "\u00fater\u00fd",
      "3": "st\u0159eda",
      "4": "\u010dtvrtek",
      "5": "p\u00e1tek",
      "6": "sobota"
    },
    "MONTH": {
      "0": "ledna",
      "1": "\u00fanora",
      "2": "b\u0159ezna",
      "3": "dubna",
      "4": "kv\u011btna",
      "5": "\u010dervna",
      "6": "\u010dervence",
      "7": "srpna",
      "8": "z\u00e1\u0159\u00ed",
      "9": "\u0159\u00edjna",
      "10": "listopadu",
      "11": "prosince"
    },
    "SHORTDAY": {
      "0": "ne",
      "1": "po",
      "2": "\u00fat",
      "3": "st",
      "4": "\u010dt",
      "5": "p\u00e1",
      "6": "so"
    },
    "SHORTMONTH": {
      "0": "Led",
      "1": "\u00dano",
      "2": "B\u0159e",
      "3": "Dub",
      "4": "Kv\u011b",
      "5": "\u010cer",
      "6": "\u010cvc",
      "7": "Srp",
      "8": "Z\u00e1\u0159",
      "9": "\u0158\u00edj",
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
    "CURRENCY_SYM": "K\u010d",
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
  "id": "cs",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n >= 2 && n <= 4) {   return PLURAL_CATEGORY.FEW;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);