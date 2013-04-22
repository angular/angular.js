angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "am",
      "1": "pm"
    },
    "DAY": {
      "0": "\u0cb0\u0cb5\u0cbf\u0cb5\u0cbe\u0cb0",
      "1": "\u0cb8\u0ccb\u0cae\u0cb5\u0cbe\u0cb0",
      "2": "\u0cae\u0c82\u0c97\u0cb3\u0cb5\u0cbe\u0cb0",
      "3": "\u0cac\u0cc1\u0ca7\u0cb5\u0cbe\u0cb0",
      "4": "\u0c97\u0cc1\u0cb0\u0cc1\u0cb5\u0cbe\u0cb0",
      "5": "\u0cb6\u0cc1\u0c95\u0ccd\u0cb0\u0cb5\u0cbe\u0cb0",
      "6": "\u0cb6\u0ca8\u0cbf\u0cb5\u0cbe\u0cb0"
    },
    "MONTH": {
      "0": "\u0c9c\u0ca8\u0cb5\u0cb0\u0cc0",
      "1": "\u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cc0",
      "2": "\u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd",
      "3": "\u0c8e\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd",
      "4": "\u0cae\u0cc6",
      "5": "\u0c9c\u0cc2\u0ca8\u0ccd",
      "6": "\u0c9c\u0cc1\u0cb2\u0cc8",
      "7": "\u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd",
      "8": "\u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd",
      "9": "\u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd",
      "10": "\u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd",
      "11": "\u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd"
    },
    "SHORTDAY": {
      "0": "\u0cb0.",
      "1": "\u0cb8\u0ccb.",
      "2": "\u0cae\u0c82.",
      "3": "\u0cac\u0cc1.",
      "4": "\u0c97\u0cc1.",
      "5": "\u0cb6\u0cc1.",
      "6": "\u0cb6\u0ca8\u0cbf."
    },
    "SHORTMONTH": {
      "0": "\u0c9c\u0ca8\u0cb5\u0cb0\u0cc0",
      "1": "\u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cc0",
      "2": "\u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd",
      "3": "\u0c8e\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd",
      "4": "\u0cae\u0cc6",
      "5": "\u0c9c\u0cc2\u0ca8\u0ccd",
      "6": "\u0c9c\u0cc1\u0cb2\u0cc8",
      "7": "\u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd",
      "8": "\u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd",
      "9": "\u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd",
      "10": "\u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd",
      "11": "\u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd"
    },
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y hh:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "hh:mm:ss a",
    "short": "d-M-yy hh:mm a",
    "shortDate": "d-M-yy",
    "shortTime": "hh:mm a"
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
  "id": "kn",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);