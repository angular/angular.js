angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "\u0e01\u0e48\u0e2d\u0e19\u0e40\u0e17\u0e35\u0e48\u0e22\u0e07",
      "1": "\u0e2b\u0e25\u0e31\u0e07\u0e40\u0e17\u0e35\u0e48\u0e22\u0e07"
    },
    "DAY": {
      "0": "\u0e27\u0e31\u0e19\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c",
      "1": "\u0e27\u0e31\u0e19\u0e08\u0e31\u0e19\u0e17\u0e23\u0e4c",
      "2": "\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23",
      "3": "\u0e27\u0e31\u0e19\u0e1e\u0e38\u0e18",
      "4": "\u0e27\u0e31\u0e19\u0e1e\u0e24\u0e2b\u0e31\u0e2a\u0e1a\u0e14\u0e35",
      "5": "\u0e27\u0e31\u0e19\u0e28\u0e38\u0e01\u0e23\u0e4c",
      "6": "\u0e27\u0e31\u0e19\u0e40\u0e2a\u0e32\u0e23\u0e4c"
    },
    "MONTH": {
      "0": "\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21",
      "1": "\u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c",
      "2": "\u0e21\u0e35\u0e19\u0e32\u0e04\u0e21",
      "3": "\u0e40\u0e21\u0e29\u0e32\u0e22\u0e19",
      "4": "\u0e1e\u0e24\u0e29\u0e20\u0e32\u0e04\u0e21",
      "5": "\u0e21\u0e34\u0e16\u0e38\u0e19\u0e32\u0e22\u0e19",
      "6": "\u0e01\u0e23\u0e01\u0e0e\u0e32\u0e04\u0e21",
      "7": "\u0e2a\u0e34\u0e07\u0e2b\u0e32\u0e04\u0e21",
      "8": "\u0e01\u0e31\u0e19\u0e22\u0e32\u0e22\u0e19",
      "9": "\u0e15\u0e38\u0e25\u0e32\u0e04\u0e21",
      "10": "\u0e1e\u0e24\u0e28\u0e08\u0e34\u0e01\u0e32\u0e22\u0e19",
      "11": "\u0e18\u0e31\u0e19\u0e27\u0e32\u0e04\u0e21"
    },
    "SHORTDAY": {
      "0": "\u0e2d\u0e32.",
      "1": "\u0e08.",
      "2": "\u0e2d.",
      "3": "\u0e1e.",
      "4": "\u0e1e\u0e24.",
      "5": "\u0e28.",
      "6": "\u0e2a."
    },
    "SHORTMONTH": {
      "0": "\u0e21.\u0e04.",
      "1": "\u0e01.\u0e1e.",
      "2": "\u0e21\u0e35.\u0e04.",
      "3": "\u0e40\u0e21.\u0e22.",
      "4": "\u0e1e.\u0e04.",
      "5": "\u0e21\u0e34.\u0e22.",
      "6": "\u0e01.\u0e04.",
      "7": "\u0e2a.\u0e04.",
      "8": "\u0e01.\u0e22.",
      "9": "\u0e15.\u0e04.",
      "10": "\u0e1e.\u0e22.",
      "11": "\u0e18.\u0e04."
    },
    "fullDate": "EEEE\u0e17\u0e35\u0e48 d MMMM G y",
    "longDate": "d MMMM y",
    "medium": "d MMM y H:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "H:mm:ss",
    "short": "d/M/yyyy H:mm",
    "shortDate": "d/M/yyyy",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u0e3f",
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
  "id": "th",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);