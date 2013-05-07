angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "\u062f\u0646",
      "1": "\u0631\u0627\u062a"
    },
    "DAY": {
      "0": "\u0627\u062a\u0648\u0627\u0631",
      "1": "\u067e\u064a\u0631",
      "2": "\u0645\u0646\u06af\u0644",
      "3": "\u0628\u062f\u0647",
      "4": "\u062c\u0645\u0639\u0631\u0627\u062a",
      "5": "\u062c\u0645\u0639\u06c1",
      "6": "\u06c1\u0641\u062a\u06c1"
    },
    "MONTH": {
      "0": "\u062c\u0646\u0648\u0631\u06cc",
      "1": "\u0641\u0631\u0648\u0631\u06cc",
      "2": "\u0645\u0627\u0631\u0686",
      "3": "\u0627\u067e\u0631\u064a\u0644",
      "4": "\u0645\u0626",
      "5": "\u062c\u0648\u0646",
      "6": "\u062c\u0648\u0644\u0627\u0626",
      "7": "\u0627\u06af\u0633\u062a",
      "8": "\u0633\u062a\u0645\u0628\u0631",
      "9": "\u0627\u06a9\u062a\u0648\u0628\u0631",
      "10": "\u0646\u0648\u0645\u0628\u0631",
      "11": "\u062f\u0633\u0645\u0628\u0631"
    },
    "SHORTDAY": {
      "0": "\u0627\u062a\u0648\u0627\u0631",
      "1": "\u067e\u064a\u0631",
      "2": "\u0645\u0646\u06af\u0644",
      "3": "\u0628\u062f\u0647",
      "4": "\u062c\u0645\u0639\u0631\u0627\u062a",
      "5": "\u062c\u0645\u0639\u06c1",
      "6": "\u06c1\u0641\u062a\u06c1"
    },
    "SHORTMONTH": {
      "0": "\u062c\u0646\u0648\u0631\u06cc",
      "1": "\u0641\u0631\u0648\u0631\u06cc",
      "2": "\u0645\u0627\u0631\u0686",
      "3": "\u0627\u067e\u0631\u064a\u0644",
      "4": "\u0645\u0626",
      "5": "\u062c\u0648\u0646",
      "6": "\u062c\u0648\u0644\u0627\u0626",
      "7": "\u0627\u06af\u0633\u062a",
      "8": "\u0633\u062a\u0645\u0628\u0631",
      "9": "\u0627\u06a9\u062a\u0648\u0628\u0631",
      "10": "\u0646\u0648\u0645\u0628\u0631",
      "11": "\u062f\u0633\u0645\u0628\u0631"
    },
    "fullDate": "EEEE\u060d d\u060d MMMM y",
    "longDate": "d\u060d MMMM y",
    "medium": "d\u060d MMM y h:mm:ss a",
    "mediumDate": "d\u060d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "d/M/yy h:mm a",
    "shortDate": "d/M/yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Rs",
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
  "id": "ur-pk",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);