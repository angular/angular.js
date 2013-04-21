angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "上午",
      "1": "下午"
    },
    "DAY": {
      "0": "星期日",
      "1": "星期一",
      "2": "星期二",
      "3": "星期三",
      "4": "星期四",
      "5": "星期五",
      "6": "星期六"
    },
    "MONTH": {
      "0": "1月",
      "1": "2月",
      "2": "3月",
      "3": "4月",
      "4": "5月",
      "5": "6月",
      "6": "7月",
      "7": "8月",
      "8": "9月",
      "9": "10月",
      "10": "11月",
      "11": "12月"
    },
    "SHORTDAY": {
      "0": "周日",
      "1": "周一",
      "2": "周二",
      "3": "周三",
      "4": "周四",
      "5": "周五",
      "6": "周六"
    },
    "SHORTMONTH": {
      "0": "1月",
      "1": "2月",
      "2": "3月",
      "3": "4月",
      "4": "5月",
      "5": "6月",
      "6": "7月",
      "7": "8月",
      "8": "9月",
      "9": "10月",
      "10": "11月",
      "11": "12月"
    },
    "fullDate": "y年M月d日EEEE",
    "longDate": "y年M月d日",
    "medium": "yyyy-M-d ah:mm:ss",
    "mediumDate": "yyyy-M-d",
    "mediumTime": "ah:mm:ss",
    "short": "yy-M-d ah:mm",
    "shortDate": "yy-M-d",
    "shortTime": "ah:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "¥",
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
        "negPre": "(\u00A4",
        "negSuf": ")",
        "posPre": "\u00A4",
        "posSuf": ""
      }
    }
  },
  "id": "zh-cn",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);