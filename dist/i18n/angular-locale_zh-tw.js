'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u4e0a\u5348",
      "\u4e0b\u5348"
    ],
    "DAY": [
      "\u661f\u671f\u65e5",
      "\u661f\u671f\u4e00",
      "\u661f\u671f\u4e8c",
      "\u661f\u671f\u4e09",
      "\u661f\u671f\u56db",
      "\u661f\u671f\u4e94",
      "\u661f\u671f\u516d"
    ],
    "ERANAMES": [
      "\u897f\u5143\u524d",
      "\u897f\u5143"
    ],
    "ERAS": [
      "\u897f\u5143\u524d",
      "\u897f\u5143"
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "1\u6708",
      "2\u6708",
      "3\u6708",
      "4\u6708",
      "5\u6708",
      "6\u6708",
      "7\u6708",
      "8\u6708",
      "9\u6708",
      "10\u6708",
      "11\u6708",
      "12\u6708"
    ],
    "SHORTDAY": [
      "\u9031\u65e5",
      "\u9031\u4e00",
      "\u9031\u4e8c",
      "\u9031\u4e09",
      "\u9031\u56db",
      "\u9031\u4e94",
      "\u9031\u516d"
    ],
    "SHORTMONTH": [
      "1\u6708",
      "2\u6708",
      "3\u6708",
      "4\u6708",
      "5\u6708",
      "6\u6708",
      "7\u6708",
      "8\u6708",
      "9\u6708",
      "10\u6708",
      "11\u6708",
      "12\u6708"
    ],
    "STANDALONEMONTH": [
      "1\u6708",
      "2\u6708",
      "3\u6708",
      "4\u6708",
      "5\u6708",
      "6\u6708",
      "7\u6708",
      "8\u6708",
      "9\u6708",
      "10\u6708",
      "11\u6708",
      "12\u6708"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "y\u5e74M\u6708d\u65e5 EEEE",
    "longDate": "y\u5e74M\u6708d\u65e5",
    "medium": "y\u5e74M\u6708d\u65e5 ah:mm:ss",
    "mediumDate": "y\u5e74M\u6708d\u65e5",
    "mediumTime": "ah:mm:ss",
    "short": "y/M/d ah:mm",
    "shortDate": "y/M/d",
    "shortTime": "ah:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "NT$",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "zh-tw",
  "localeID": "zh_TW",
  "pluralCat": function(n, opt_precision) {  return PLURAL_CATEGORY.OTHER;}
});
}]);
