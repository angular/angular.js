angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "am",
      "1": "pm"
    },
    "DAY": {
      "0": "\u0b30\u0b2c\u0b3f\u0b2c\u0b3e\u0b30",
      "1": "\u0b38\u0b4b\u0b2e\u0b2c\u0b3e\u0b30",
      "2": "\u0b2e\u0b19\u0b4d\u0b17\u0b33\u0b2c\u0b3e\u0b30",
      "3": "\u0b2c\u0b41\u0b27\u0b2c\u0b3e\u0b30",
      "4": "\u0b17\u0b41\u0b30\u0b41\u0b2c\u0b3e\u0b30",
      "5": "\u0b36\u0b41\u0b15\u0b4d\u0b30\u0b2c\u0b3e\u0b30",
      "6": "\u0b36\u0b28\u0b3f\u0b2c\u0b3e\u0b30"
    },
    "MONTH": {
      "0": "\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40",
      "1": "\u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40",
      "2": "\u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a",
      "3": "\u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32",
      "4": "\u0b2e\u0b47",
      "5": "\u0b1c\u0b41\u0b28",
      "6": "\u0b1c\u0b41\u0b32\u0b3e\u0b07",
      "7": "\u0b05\u0b17\u0b37\u0b4d\u0b1f",
      "8": "\u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30",
      "9": "\u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30",
      "10": "\u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30",
      "11": "\u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30"
    },
    "SHORTDAY": {
      "0": "\u0b30\u0b2c\u0b3f",
      "1": "\u0b38\u0b4b\u0b2e",
      "2": "\u0b2e\u0b19\u0b4d\u0b17\u0b33",
      "3": "\u0b2c\u0b41\u0b27",
      "4": "\u0b17\u0b41\u0b30\u0b41",
      "5": "\u0b36\u0b41\u0b15\u0b4d\u0b30",
      "6": "\u0b36\u0b28\u0b3f"
    },
    "SHORTMONTH": {
      "0": "\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40",
      "1": "\u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40",
      "2": "\u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a",
      "3": "\u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32",
      "4": "\u0b2e\u0b47",
      "5": "\u0b1c\u0b41\u0b28",
      "6": "\u0b1c\u0b41\u0b32\u0b3e\u0b07",
      "7": "\u0b05\u0b17\u0b37\u0b4d\u0b1f",
      "8": "\u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30",
      "9": "\u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30",
      "10": "\u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30",
      "11": "\u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30"
    },
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "d-M-yy h:mm a",
    "shortDate": "d-M-yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20b9",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
    "PATTERNS": {
      "0": {
        "gSize": 2,
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
        "gSize": 2,
        "lgSize": 3,
        "macFrac": 0,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "\u00a4\u00a0-",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    }
  },
  "id": "or",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);