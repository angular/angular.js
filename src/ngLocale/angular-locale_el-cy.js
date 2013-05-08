angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "\u03c0.\u03bc.",
      "1": "\u03bc.\u03bc."
    },
    "DAY": {
      "0": "\u039a\u03c5\u03c1\u03b9\u03b1\u03ba\u03ae",
      "1": "\u0394\u03b5\u03c5\u03c4\u03ad\u03c1\u03b1",
      "2": "\u03a4\u03c1\u03af\u03c4\u03b7",
      "3": "\u03a4\u03b5\u03c4\u03ac\u03c1\u03c4\u03b7",
      "4": "\u03a0\u03ad\u03bc\u03c0\u03c4\u03b7",
      "5": "\u03a0\u03b1\u03c1\u03b1\u03c3\u03ba\u03b5\u03c5\u03ae",
      "6": "\u03a3\u03ac\u03b2\u03b2\u03b1\u03c4\u03bf"
    },
    "MONTH": {
      "0": "\u0399\u03b1\u03bd\u03bf\u03c5\u03b1\u03c1\u03af\u03bf\u03c5",
      "1": "\u03a6\u03b5\u03b2\u03c1\u03bf\u03c5\u03b1\u03c1\u03af\u03bf\u03c5",
      "2": "\u039c\u03b1\u03c1\u03c4\u03af\u03bf\u03c5",
      "3": "\u0391\u03c0\u03c1\u03b9\u03bb\u03af\u03bf\u03c5",
      "4": "\u039c\u03b1\u0390\u03bf\u03c5",
      "5": "\u0399\u03bf\u03c5\u03bd\u03af\u03bf\u03c5",
      "6": "\u0399\u03bf\u03c5\u03bb\u03af\u03bf\u03c5",
      "7": "\u0391\u03c5\u03b3\u03bf\u03cd\u03c3\u03c4\u03bf\u03c5",
      "8": "\u03a3\u03b5\u03c0\u03c4\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5",
      "9": "\u039f\u03ba\u03c4\u03c9\u03b2\u03c1\u03af\u03bf\u03c5",
      "10": "\u039d\u03bf\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5",
      "11": "\u0394\u03b5\u03ba\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5"
    },
    "SHORTDAY": {
      "0": "\u039a\u03c5\u03c1",
      "1": "\u0394\u03b5\u03c5",
      "2": "\u03a4\u03c1\u03b9",
      "3": "\u03a4\u03b5\u03c4",
      "4": "\u03a0\u03b5\u03bc",
      "5": "\u03a0\u03b1\u03c1",
      "6": "\u03a3\u03b1\u03b2"
    },
    "SHORTMONTH": {
      "0": "\u0399\u03b1\u03bd",
      "1": "\u03a6\u03b5\u03b2",
      "2": "\u039c\u03b1\u03c1",
      "3": "\u0391\u03c0\u03c1",
      "4": "\u039c\u03b1\u03ca",
      "5": "\u0399\u03bf\u03c5\u03bd",
      "6": "\u0399\u03bf\u03c5\u03bb",
      "7": "\u0391\u03c5\u03b3",
      "8": "\u03a3\u03b5\u03c0",
      "9": "\u039f\u03ba\u03c4",
      "10": "\u039d\u03bf\u03b5",
      "11": "\u0394\u03b5\u03ba"
    },
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "d/M/yy h:mm a",
    "shortDate": "d/M/yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
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
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    }
  },
  "id": "el-cy",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);