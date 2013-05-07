angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "am",
      "1": "pm"
    },
    "DAY": {
      "0": "\u0c06\u0c26\u0c3f\u0c35\u0c3e\u0c30\u0c02",
      "1": "\u0c38\u0c4b\u0c2e\u0c35\u0c3e\u0c30\u0c02",
      "2": "\u0c2e\u0c02\u0c17\u0c33\u0c35\u0c3e\u0c30\u0c02",
      "3": "\u0c2c\u0c41\u0c27\u0c35\u0c3e\u0c30\u0c02",
      "4": "\u0c17\u0c41\u0c30\u0c41\u0c35\u0c3e\u0c30\u0c02",
      "5": "\u0c36\u0c41\u0c15\u0c4d\u0c30\u0c35\u0c3e\u0c30\u0c02",
      "6": "\u0c36\u0c28\u0c3f\u0c35\u0c3e\u0c30\u0c02"
    },
    "MONTH": {
      "0": "\u0c1c\u0c28\u0c35\u0c30\u0c3f",
      "1": "\u0c2b\u0c3f\u0c2c\u0c4d\u0c30\u0c35\u0c30\u0c3f",
      "2": "\u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f",
      "3": "\u0c0e\u0c2a\u0c4d\u0c30\u0c3f\u0c32\u0c4d",
      "4": "\u0c2e\u0c47",
      "5": "\u0c1c\u0c42\u0c28\u0c4d",
      "6": "\u0c1c\u0c42\u0c32\u0c48",
      "7": "\u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41",
      "8": "\u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d",
      "9": "\u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d",
      "10": "\u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d",
      "11": "\u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d"
    },
    "SHORTDAY": {
      "0": "\u0c06\u0c26\u0c3f",
      "1": "\u0c38\u0c4b\u0c2e",
      "2": "\u0c2e\u0c02\u0c17\u0c33",
      "3": "\u0c2c\u0c41\u0c27",
      "4": "\u0c17\u0c41\u0c30\u0c41",
      "5": "\u0c36\u0c41\u0c15\u0c4d\u0c30",
      "6": "\u0c36\u0c28\u0c3f"
    },
    "SHORTMONTH": {
      "0": "\u0c1c\u0c28",
      "1": "\u0c2b\u0c3f\u0c2c\u0c4d\u0c30",
      "2": "\u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f",
      "3": "\u0c0f\u0c2a\u0c4d\u0c30\u0c3f",
      "4": "\u0c2e\u0c47",
      "5": "\u0c1c\u0c42\u0c28\u0c4d",
      "6": "\u0c1c\u0c42\u0c32\u0c48",
      "7": "\u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41",
      "8": "\u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d",
      "9": "\u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d",
      "10": "\u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d",
      "11": "\u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d"
    },
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "dd-MM-yy h:mm a",
    "shortDate": "dd-MM-yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20b9",
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
        "negPre": "(\u00a4",
        "negSuf": ")",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    }
  },
  "id": "te",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);