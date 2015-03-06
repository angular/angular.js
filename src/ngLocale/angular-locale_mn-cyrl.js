'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u04ae\u04e8",
      "\u04ae\u0425"
    ],
    "DAY": [
      "\u043d\u044f\u043c",
      "\u0434\u0430\u0432\u0430\u0430",
      "\u043c\u044f\u0433\u043c\u0430\u0440",
      "\u043b\u0445\u0430\u0433\u0432\u0430",
      "\u043f\u04af\u0440\u044d\u0432",
      "\u0431\u0430\u0430\u0441\u0430\u043d",
      "\u0431\u044f\u043c\u0431\u0430"
    ],
    "ERANAMES": [
      "\u043c\u0430\u043d\u0430\u0439 \u044d\u0440\u0438\u043d\u0438\u0439 \u04e9\u043c\u043d\u04e9\u0445",
      "\u043c\u0430\u043d\u0430\u0439 \u044d\u0440\u0438\u043d\u0438\u0439"
    ],
    "ERAS": [
      "\u041c\u042d\u04e8",
      "\u041c\u042d"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "\u041d\u044d\u0433\u0434\u04af\u0433\u044d\u044d\u0440 \u0441\u0430\u0440",
      "\u0425\u043e\u0451\u0440\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440",
      "\u0413\u0443\u0440\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440",
      "\u0414\u04e9\u0440\u04e9\u0432\u0434\u04af\u0433\u044d\u044d\u0440 \u0441\u0430\u0440",
      "\u0422\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440",
      "\u0417\u0443\u0440\u0433\u0430\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440",
      "\u0414\u043e\u043b\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440",
      "\u041d\u0430\u0439\u043c\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440",
      "\u0415\u0441\u0434\u04af\u0433\u044d\u044d\u0440 \u0441\u0430\u0440",
      "\u0410\u0440\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440",
      "\u0410\u0440\u0432\u0430\u043d \u043d\u044d\u0433\u0434\u04af\u0433\u044d\u044d\u0440 \u0441\u0430\u0440",
      "\u0410\u0440\u0432\u0430\u043d \u0445\u043e\u0451\u0440\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440"
    ],
    "SHORTDAY": [
      "\u041d\u044f",
      "\u0414\u0430",
      "\u041c\u044f",
      "\u041b\u0445",
      "\u041f\u04af",
      "\u0411\u0430",
      "\u0411\u044f"
    ],
    "SHORTMONTH": [
      "1-\u0440 \u0441\u0430\u0440",
      "2-\u0440 \u0441\u0430\u0440",
      "3-\u0440 \u0441\u0430\u0440",
      "4-\u0440 \u0441\u0430\u0440",
      "5-\u0440 \u0441\u0430\u0440",
      "6-\u0440 \u0441\u0430\u0440",
      "7-\u0440 \u0441\u0430\u0440",
      "8-\u0440 \u0441\u0430\u0440",
      "9-\u0440 \u0441\u0430\u0440",
      "10-\u0440 \u0441\u0430\u0440",
      "11-\u0440 \u0441\u0430\u0440",
      "12-\u0440 \u0441\u0430\u0440"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, y '\u043e\u043d\u044b' MM '\u0441\u0430\u0440\u044b\u043d' d",
    "longDate": "y '\u043e\u043d\u044b' MM '\u0441\u0430\u0440\u044b\u043d' d",
    "medium": "y MMM d HH:mm:ss",
    "mediumDate": "y MMM d",
    "mediumTime": "HH:mm:ss",
    "short": "y-MM-dd HH:mm",
    "shortDate": "y-MM-dd",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
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
        "negPre": "\u00a4\u00a0-",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "mn-cyrl",
  "pluralCat": function(n, opt_precision) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
