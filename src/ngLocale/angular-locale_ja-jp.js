angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "\u5348\u524d",
      "1": "\u5348\u5f8c"
    },
    "DAY": {
      "0": "\u65e5\u66dc\u65e5",
      "1": "\u6708\u66dc\u65e5",
      "2": "\u706b\u66dc\u65e5",
      "3": "\u6c34\u66dc\u65e5",
      "4": "\u6728\u66dc\u65e5",
      "5": "\u91d1\u66dc\u65e5",
      "6": "\u571f\u66dc\u65e5"
    },
    "MONTH": {
      "0": "1\u6708",
      "1": "2\u6708",
      "2": "3\u6708",
      "3": "4\u6708",
      "4": "5\u6708",
      "5": "6\u6708",
      "6": "7\u6708",
      "7": "8\u6708",
      "8": "9\u6708",
      "9": "10\u6708",
      "10": "11\u6708",
      "11": "12\u6708"
    },
    "SHORTDAY": {
      "0": "\u65e5",
      "1": "\u6708",
      "2": "\u706b",
      "3": "\u6c34",
      "4": "\u6728",
      "5": "\u91d1",
      "6": "\u571f"
    },
    "SHORTMONTH": {
      "0": "1\u6708",
      "1": "2\u6708",
      "2": "3\u6708",
      "3": "4\u6708",
      "4": "5\u6708",
      "5": "6\u6708",
      "6": "7\u6708",
      "7": "8\u6708",
      "8": "9\u6708",
      "9": "10\u6708",
      "10": "11\u6708",
      "11": "12\u6708"
    },
    "fullDate": "y\u5e74M\u6708d\u65e5EEEE",
    "longDate": "y\u5e74M\u6708d\u65e5",
    "medium": "yyyy/MM/dd H:mm:ss",
    "mediumDate": "yyyy/MM/dd",
    "mediumTime": "H:mm:ss",
    "short": "yyyy/MM/dd H:mm",
    "shortDate": "yyyy/MM/dd",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u00a5",
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
  "id": "ja-jp",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);