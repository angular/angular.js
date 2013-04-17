angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "\u0635",
      "1": "\u0645"
    },
    "DAY": {
      "0": "\u0627\u0644\u0623\u062d\u062f",
      "1": "\u0627\u0644\u0627\u062b\u0646\u064a\u0646",
      "2": "\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621",
      "3": "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621",
      "4": "\u0627\u0644\u062e\u0645\u064a\u0633",
      "5": "\u0627\u0644\u062c\u0645\u0639\u0629",
      "6": "\u0627\u0644\u0633\u0628\u062a"
    },
    "MONTH": {
      "0": "\u064a\u0646\u0627\u064a\u0631",
      "1": "\u0641\u0628\u0631\u0627\u064a\u0631",
      "2": "\u0645\u0627\u0631\u0633",
      "3": "\u0623\u0628\u0631\u064a\u0644",
      "4": "\u0645\u0627\u064a\u0648",
      "5": "\u064a\u0648\u0646\u064a\u0648",
      "6": "\u064a\u0648\u0644\u064a\u0648",
      "7": "\u0623\u063a\u0633\u0637\u0633",
      "8": "\u0633\u0628\u062a\u0645\u0628\u0631",
      "9": "\u0623\u0643\u062a\u0648\u0628\u0631",
      "10": "\u0646\u0648\u0641\u0645\u0628\u0631",
      "11": "\u062f\u064a\u0633\u0645\u0628\u0631"
    },
    "SHORTDAY": {
      "0": "\u0627\u0644\u0623\u062d\u062f",
      "1": "\u0627\u0644\u0627\u062b\u0646\u064a\u0646",
      "2": "\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621",
      "3": "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621",
      "4": "\u0627\u0644\u062e\u0645\u064a\u0633",
      "5": "\u0627\u0644\u062c\u0645\u0639\u0629",
      "6": "\u0627\u0644\u0633\u0628\u062a"
    },
    "SHORTMONTH": {
      "0": "\u064a\u0646\u0627\u064a\u0631",
      "1": "\u0641\u0628\u0631\u0627\u064a\u0631",
      "2": "\u0645\u0627\u0631\u0633",
      "3": "\u0623\u0628\u0631\u064a\u0644",
      "4": "\u0645\u0627\u064a\u0648",
      "5": "\u064a\u0648\u0646\u064a\u0648",
      "6": "\u064a\u0648\u0644\u064a\u0648",
      "7": "\u0623\u063a\u0633\u0637\u0633",
      "8": "\u0633\u0628\u062a\u0645\u0628\u0631",
      "9": "\u0623\u0643\u062a\u0648\u0628\u0631",
      "10": "\u0646\u0648\u0641\u0645\u0628\u0631",
      "11": "\u062f\u064a\u0633\u0645\u0628\u0631"
    },
    "fullDate": "EEEE\u060c d MMMM\u060c y",
    "longDate": "d MMMM\u060c y",
    "medium": "dd\u200f/MM\u200f/yyyy h:mm:ss a",
    "mediumDate": "dd\u200f/MM\u200f/yyyy",
    "mediumTime": "h:mm:ss a",
    "short": "d\u200f/M\u200f/yyyy h:mm a",
    "shortDate": "d\u200f/M\u200f/yyyy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u00a3",
    "DECIMAL_SEP": "\u066b",
    "GROUP_SEP": "\u066c",
    "PATTERNS": {
      "0": {
        "gSize": 0,
        "lgSize": 0,
        "macFrac": 0,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "",
        "negSuf": "-",
        "posPre": "",
        "posSuf": ""
      },
      "1": {
        "gSize": 0,
        "lgSize": 0,
        "macFrac": 0,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "\u00a4\u00a0",
        "negSuf": "-",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    }
  },
  "id": "ar-bh",
  "pluralCat": function (n) {  if (n == 0) {   return PLURAL_CATEGORY.ZERO;  }  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  if (n == 2) {   return PLURAL_CATEGORY.TWO;  }  if (n == (n | 0) && n % 100 >= 3 && n % 100 <= 10) {   return PLURAL_CATEGORY.FEW;  }  if (n == (n | 0) && n % 100 >= 11 && n % 100 <= 99) {   return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);