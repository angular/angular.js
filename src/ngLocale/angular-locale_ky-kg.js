'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u0442\u0430\u04a3\u043a\u044b",
      "\u0442\u04af\u0448\u0442\u04e9\u043d \u043a\u0438\u0439\u0438\u043d\u043a\u0438"
    ],
    "DAY": [
      "\u0436\u0435\u043a\u0448\u0435\u043c\u0431\u0438",
      "\u0434\u04af\u0439\u0448\u04e9\u043c\u0431\u04af",
      "\u0448\u0435\u0439\u0448\u0435\u043c\u0431\u0438",
      "\u0448\u0430\u0440\u0448\u0435\u043c\u0431\u0438",
      "\u0431\u0435\u0439\u0448\u0435\u043c\u0431\u0438",
      "\u0436\u0443\u043c\u0430",
      "\u0438\u0448\u0435\u043c\u0431\u0438"
    ],
    "ERANAMES": [
      "\u0431\u0438\u0437\u0434\u0438\u043d \u0437\u0430\u043c\u0430\u043d\u0433\u0430 \u0447\u0435\u0439\u0438\u043d",
      "\u0431\u0438\u0437\u0434\u0438\u043d \u0437\u0430\u043c\u0430\u043d"
    ],
    "ERAS": [
      "\u0431.\u0437.\u0447.",
      "\u0431.\u0437."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "\u044f\u043d\u0432\u0430\u0440\u044c",
      "\u0444\u0435\u0432\u0440\u0430\u043b\u044c",
      "\u043c\u0430\u0440\u0442",
      "\u0430\u043f\u0440\u0435\u043b\u044c",
      "\u043c\u0430\u0439",
      "\u0438\u044e\u043d\u044c",
      "\u0438\u044e\u043b\u044c",
      "\u0430\u0432\u0433\u0443\u0441\u0442",
      "\u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044c",
      "\u043e\u043a\u0442\u044f\u0431\u0440\u044c",
      "\u043d\u043e\u044f\u0431\u0440\u044c",
      "\u0434\u0435\u043a\u0430\u0431\u0440\u044c"
    ],
    "SHORTDAY": [
      "\u0436\u0435\u043a.",
      "\u0434\u04af\u0439.",
      "\u0448\u0435\u0439\u0448.",
      "\u0448\u0430\u0440\u0448.",
      "\u0431\u0435\u0439\u0448.",
      "\u0436\u0443\u043c\u0430",
      "\u0438\u0448\u043c."
    ],
    "SHORTMONTH": [
      "\u044f\u043d\u0432.",
      "\u0444\u0435\u0432.",
      "\u043c\u0430\u0440.",
      "\u0430\u043f\u0440.",
      "\u043c\u0430\u0439",
      "\u0438\u044e\u043d.",
      "\u0438\u044e\u043b.",
      "\u0430\u0432\u0433.",
      "\u0441\u0435\u043d.",
      "\u043e\u043a\u0442.",
      "\u043d\u043e\u044f.",
      "\u0434\u0435\u043a."
    ],
    "STANDALONEMONTH": [
      "\u042f\u043d\u0432\u0430\u0440\u044c",
      "\u0424\u0435\u0432\u0440\u0430\u043b\u044c",
      "\u041c\u0430\u0440\u0442",
      "\u0410\u043f\u0440\u0435\u043b\u044c",
      "\u041c\u0430\u0439",
      "\u0418\u044e\u043d\u044c",
      "\u0418\u044e\u043b\u044c",
      "\u0410\u0432\u0433\u0443\u0441\u0442",
      "\u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c",
      "\u041e\u043a\u0442\u044f\u0431\u0440\u044c",
      "\u041d\u043e\u044f\u0431\u0440\u044c",
      "\u0414\u0435\u043a\u0430\u0431\u0440\u044c"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "y-'\u0436'., d-MMMM, EEEE",
    "longDate": "y-'\u0436'., d-MMMM",
    "medium": "y-'\u0436'., d-MMM HH:mm:ss",
    "mediumDate": "y-'\u0436'., d-MMM",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/yy HH:mm",
    "shortDate": "d/M/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "KGS",
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
  "id": "ky-kg",
  "localeID": "ky_KG",
  "pluralCat": function(n, opt_precision) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
