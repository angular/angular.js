'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "AM",
      "PM"
    ],
    "DAY": [
      "\u0ab0\u0ab5\u0abf\u0ab5\u0abe\u0ab0",
      "\u0ab8\u0acb\u0aae\u0ab5\u0abe\u0ab0",
      "\u0aae\u0a82\u0a97\u0ab3\u0ab5\u0abe\u0ab0",
      "\u0aac\u0ac1\u0aa7\u0ab5\u0abe\u0ab0",
      "\u0a97\u0ac1\u0ab0\u0ac1\u0ab5\u0abe\u0ab0",
      "\u0ab6\u0ac1\u0a95\u0acd\u0ab0\u0ab5\u0abe\u0ab0",
      "\u0ab6\u0aa8\u0abf\u0ab5\u0abe\u0ab0"
    ],
    "MONTH": [
      "\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1\u0a86\u0ab0\u0ac0",
      "\u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1\u0a86\u0ab0\u0ac0",
      "\u0aae\u0abe\u0ab0\u0acd\u0a9a",
      "\u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2",
      "\u0aae\u0ac7",
      "\u0a9c\u0ac2\u0aa8",
      "\u0a9c\u0ac1\u0ab2\u0abe\u0a88",
      "\u0a91\u0a97\u0ab8\u0acd\u0a9f",
      "\u0ab8\u0aaa\u0acd\u0a9f\u0ac7\u0aae\u0acd\u0aac\u0ab0",
      "\u0a91\u0a95\u0acd\u0a9f\u0acb\u0aac\u0ab0",
      "\u0aa8\u0ab5\u0ac7\u0aae\u0acd\u0aac\u0ab0",
      "\u0aa1\u0abf\u0ab8\u0ac7\u0aae\u0acd\u0aac\u0ab0"
    ],
    "SHORTDAY": [
      "\u0ab0\u0ab5\u0abf",
      "\u0ab8\u0acb\u0aae",
      "\u0aae\u0a82\u0a97\u0ab3",
      "\u0aac\u0ac1\u0aa7",
      "\u0a97\u0ac1\u0ab0\u0ac1",
      "\u0ab6\u0ac1\u0a95\u0acd\u0ab0",
      "\u0ab6\u0aa8\u0abf"
    ],
    "SHORTMONTH": [
      "\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1",
      "\u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1",
      "\u0aae\u0abe\u0ab0\u0acd\u0a9a",
      "\u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2",
      "\u0aae\u0ac7",
      "\u0a9c\u0ac2\u0aa8",
      "\u0a9c\u0ac1\u0ab2\u0abe\u0a88",
      "\u0a91\u0a97\u0ab8\u0acd\u0a9f",
      "\u0ab8\u0aaa\u0acd\u0a9f\u0ac7",
      "\u0a91\u0a95\u0acd\u0a9f\u0acb",
      "\u0aa8\u0ab5\u0ac7",
      "\u0aa1\u0abf\u0ab8\u0ac7"
    ],
    "fullDate": "EEEE, d MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "d MMM, y hh:mm:ss a",
    "mediumDate": "d MMM, y",
    "mediumTime": "hh:mm:ss a",
    "short": "d-MM-yy hh:mm a",
    "shortDate": "d-MM-yy",
    "shortTime": "hh:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20b9",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
    "PATTERNS": [
      {
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
      {
        "gSize": 2,
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
    ]
  },
  "id": "gu",
  "pluralCat": function (n, opt_precision) {  var i = n | 0;  if (i == 0 || n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);