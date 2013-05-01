angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "QN",
      "1": "WN"
    },
    "DAY": {
      "0": "Il-\u0126add",
      "1": "It-Tnejn",
      "2": "It-Tlieta",
      "3": "L-Erbg\u0127a",
      "4": "Il-\u0126amis",
      "5": "Il-\u0120img\u0127a",
      "6": "Is-Sibt"
    },
    "MONTH": {
      "0": "Jannar",
      "1": "Frar",
      "2": "Marzu",
      "3": "April",
      "4": "Mejju",
      "5": "\u0120unju",
      "6": "Lulju",
      "7": "Awwissu",
      "8": "Settembru",
      "9": "Ottubru",
      "10": "Novembru",
      "11": "Di\u010bembru"
    },
    "SHORTDAY": {
      "0": "\u0126ad",
      "1": "Tne",
      "2": "Tli",
      "3": "Erb",
      "4": "\u0126am",
      "5": "\u0120im",
      "6": "Sib"
    },
    "SHORTMONTH": {
      "0": "Jan",
      "1": "Fra",
      "2": "Mar",
      "3": "Apr",
      "4": "Mej",
      "5": "\u0120un",
      "6": "Lul",
      "7": "Aww",
      "8": "Set",
      "9": "Ott",
      "10": "Nov",
      "11": "Di\u010b"
    },
    "fullDate": "EEEE, d 'ta'\u2019 MMMM y",
    "longDate": "d 'ta'\u2019 MMMM y",
    "medium": "dd MMM y HH:mm:ss",
    "mediumDate": "dd MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yyyy HH:mm",
    "shortDate": "dd/MM/yyyy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    }
  },
  "id": "mt",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  if (n == 0 || n == (n | 0) && n % 100 >= 2 && n % 100 <= 10) {   return PLURAL_CATEGORY.FEW;  }  if (n == (n | 0) && n % 100 >= 11 && n % 100 <= 19) {   return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);