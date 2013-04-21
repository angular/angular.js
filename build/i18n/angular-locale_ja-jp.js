angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "午前",
      "1": "午後"
    },
    "DAY": {
      "0": "日曜日",
      "1": "月曜日",
      "2": "火曜日",
      "3": "水曜日",
      "4": "木曜日",
      "5": "金曜日",
      "6": "土曜日"
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
      "0": "日",
      "1": "月",
      "2": "火",
      "3": "水",
      "4": "木",
      "5": "金",
      "6": "土"
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
    "medium": "yyyy/MM/dd H:mm:ss",
    "mediumDate": "yyyy/MM/dd",
    "mediumTime": "H:mm:ss",
    "short": "yyyy/MM/dd H:mm",
    "shortDate": "yyyy/MM/dd",
    "shortTime": "H:mm"
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
        "negPre": "\u00A4-",
        "negSuf": "",
        "posPre": "\u00A4",
        "posSuf": ""
      }
    }
  },
  "id": "ja-jp",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);