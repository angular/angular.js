angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "am",
      "1": "pm"
    },
    "DAY": {
      "0": "\u0b9e\u0bbe\u0baf\u0bbf\u0bb1\u0bc1",
      "1": "\u0ba4\u0bbf\u0b99\u0bcd\u0b95\u0bb3\u0bcd",
      "2": "\u0b9a\u0bc6\u0bb5\u0bcd\u0bb5\u0bbe\u0baf\u0bcd",
      "3": "\u0baa\u0bc1\u0ba4\u0ba9\u0bcd",
      "4": "\u0bb5\u0bbf\u0baf\u0bbe\u0bb4\u0ba9\u0bcd",
      "5": "\u0bb5\u0bc6\u0bb3\u0bcd\u0bb3\u0bbf",
      "6": "\u0b9a\u0ba9\u0bbf"
    },
    "MONTH": {
      "0": "\u0b9c\u0ba9\u0bb5\u0bb0\u0bbf",
      "1": "\u0baa\u0bbf\u0baa\u0bcd\u0bb0\u0bb5\u0bb0\u0bbf",
      "2": "\u0bae\u0bbe\u0bb0\u0bcd\u0b9a\u0bcd",
      "3": "\u0b8f\u0baa\u0bcd\u0bb0\u0bb2\u0bcd",
      "4": "\u0bae\u0bc7",
      "5": "\u0b9c\u0bc2\u0ba9\u0bcd",
      "6": "\u0b9c\u0bc2\u0bb2\u0bc8",
      "7": "\u0b86\u0b95\u0bb8\u0bcd\u0b9f\u0bcd",
      "8": "\u0b9a\u0bc6\u0baa\u0bcd\u0b9f\u0bae\u0bcd\u0baa\u0bb0\u0bcd",
      "9": "\u0b85\u0b95\u0bcd\u0b9f\u0bcb\u0baa\u0bb0\u0bcd",
      "10": "\u0ba8\u0bb5\u0bae\u0bcd\u0baa\u0bb0\u0bcd",
      "11": "\u0b9f\u0bbf\u0b9a\u0bae\u0bcd\u0baa\u0bb0\u0bcd"
    },
    "SHORTDAY": {
      "0": "\u0b9e\u0bbe",
      "1": "\u0ba4\u0bbf",
      "2": "\u0b9a\u0bc6",
      "3": "\u0baa\u0bc1",
      "4": "\u0bb5\u0bbf",
      "5": "\u0bb5\u0bc6",
      "6": "\u0b9a"
    },
    "SHORTMONTH": {
      "0": "\u0b9c\u0ba9.",
      "1": "\u0baa\u0bbf\u0baa\u0bcd.",
      "2": "\u0bae\u0bbe\u0bb0\u0bcd.",
      "3": "\u0b8f\u0baa\u0bcd.",
      "4": "\u0bae\u0bc7",
      "5": "\u0b9c\u0bc2\u0ba9\u0bcd",
      "6": "\u0b9c\u0bc2\u0bb2\u0bc8",
      "7": "\u0b86\u0b95.",
      "8": "\u0b9a\u0bc6\u0baa\u0bcd.",
      "9": "\u0b85\u0b95\u0bcd.",
      "10": "\u0ba8\u0bb5.",
      "11": "\u0b9f\u0bbf\u0b9a."
    },
    "fullDate": "EEEE, d MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "d MMM, y h:mm:ss a",
    "mediumDate": "d MMM, y",
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
  "id": "ta",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);