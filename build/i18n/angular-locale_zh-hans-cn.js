angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "\u4e0a\u5348",
      "1": "\u4e0b\u5348"
    },
    "DAY": {
      "0": "\u661f\u671f\u65e5",
      "1": "\u661f\u671f\u4e00",
      "2": "\u661f\u671f\u4e8c",
      "3": "\u661f\u671f\u4e09",
      "4": "\u661f\u671f\u56db",
      "5": "\u661f\u671f\u4e94",
      "6": "\u661f\u671f\u516d"
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
      "0": "\u5468\u65e5",
      "1": "\u5468\u4e00",
      "2": "\u5468\u4e8c",
      "3": "\u5468\u4e09",
      "4": "\u5468\u56db",
      "5": "\u5468\u4e94",
      "6": "\u5468\u516d"
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
    "medium": "yyyy-M-d ah:mm:ss",
    "mediumDate": "yyyy-M-d",
    "mediumTime": "ah:mm:ss",
    "short": "yy-M-d ah:mm",
    "shortDate": "yy-M-d",
    "shortTime": "ah:mm"
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
        "negPre": "(\u00a4",
        "negSuf": ")",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    }
  },
  "id": "zh-hans-cn",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);