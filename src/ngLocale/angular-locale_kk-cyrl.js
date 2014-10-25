'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u0442\u04af\u0441\u043a\u0435 \u0434\u0435\u0439\u0456\u043d",
      "\u0442\u04af\u0441\u0442\u0435\u043d \u043a\u0435\u0439\u0456\u043d"
    ],
    "DAY": [
      "\u0436\u0435\u043a\u0441\u0435\u043d\u0431\u0456",
      "\u0434\u04af\u0439\u0441\u0435\u043d\u0431\u0456",
      "\u0441\u0435\u0439\u0441\u0435\u043d\u0431\u0456",
      "\u0441\u04d9\u0440\u0441\u0435\u043d\u0431\u0456",
      "\u0431\u0435\u0439\u0441\u0435\u043d\u0431\u0456",
      "\u0436\u04b1\u043c\u0430",
      "\u0441\u0435\u043d\u0431\u0456"
    ],
    "MONTH": [
      "\u049b\u0430\u04a3\u0442\u0430\u0440",
      "\u0430\u049b\u043f\u0430\u043d",
      "\u043d\u0430\u0443\u0440\u044b\u0437",
      "\u0441\u04d9\u0443\u0456\u0440",
      "\u043c\u0430\u043c\u044b\u0440",
      "\u043c\u0430\u0443\u0441\u044b\u043c",
      "\u0448\u0456\u043b\u0434\u0435",
      "\u0442\u0430\u043c\u044b\u0437",
      "\u049b\u044b\u0440\u043a\u04af\u0439\u0435\u043a",
      "\u049b\u0430\u0437\u0430\u043d",
      "\u049b\u0430\u0440\u0430\u0448\u0430",
      "\u0436\u0435\u043b\u0442\u043e\u049b\u0441\u0430\u043d"
    ],
    "SHORTDAY": [
      "\u0436\u0441.",
      "\u0434\u0441.",
      "\u0441\u0441.",
      "\u0441\u0440.",
      "\u0431\u0441.",
      "\u0436\u043c.",
      "\u0441\u0431."
    ],
    "SHORTMONTH": [
      "\u049b\u0430\u04a3.",
      "\u0430\u049b\u043f.",
      "\u043d\u0430\u0443.",
      "\u0441\u04d9\u0443.",
      "\u043c\u0430\u043c.",
      "\u043c\u0430\u0443.",
      "\u0448\u0456\u043b.",
      "\u0442\u0430\u043c.",
      "\u049b\u044b\u0440.",
      "\u049b\u0430\u0437.",
      "\u049b\u0430\u0440.",
      "\u0436\u0435\u043b\u0442."
    ],
    "fullDate": "EEEE, d MMMM y '\u0436'.",
    "longDate": "d MMMM y '\u0436'.",
    "medium": "dd.MM.y HH:mm:ss",
    "mediumDate": "dd.MM.y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": "\u00a0",
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
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "kk-cyrl",
  "pluralCat": function(n, opt_precision) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
