'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u0422\u041e",
      "\u0422\u041a"
    ],
    "DAY": [
      "\u044f\u043a\u0448\u0430\u043d\u0431\u0430",
      "\u0434\u0443\u0448\u0430\u043d\u0431\u0430",
      "\u0441\u0435\u0448\u0430\u043d\u0431\u0430",
      "\u0447\u043e\u0440\u0448\u0430\u043d\u0431\u0430",
      "\u043f\u0430\u0439\u0448\u0430\u043d\u0431\u0430",
      "\u0436\u0443\u043c\u0430",
      "\u0448\u0430\u043d\u0431\u0430"
    ],
    "ERANAMES": [
      "\u043c\u0438\u043b\u043e\u0434\u0434\u0430\u043d \u0430\u0432\u0432\u0430\u043b\u0433\u0438",
      "\u043c\u0438\u043b\u043e\u0434\u0438\u0439"
    ],
    "ERAS": [
      "\u043c.\u0430.",
      "\u043c\u0438\u043b\u043e\u0434\u0438\u0439"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "\u044f\u043d\u0432\u0430\u0440",
      "\u0444\u0435\u0432\u0440\u0430\u043b",
      "\u043c\u0430\u0440\u0442",
      "\u0430\u043f\u0440\u0435\u043b",
      "\u043c\u0430\u0439",
      "\u0438\u044e\u043d",
      "\u0438\u044e\u043b",
      "\u0430\u0432\u0433\u0443\u0441\u0442",
      "\u0441\u0435\u043d\u0442\u044f\u0431\u0440",
      "\u043e\u043a\u0442\u044f\u0431\u0440",
      "\u043d\u043e\u044f\u0431\u0440",
      "\u0434\u0435\u043a\u0430\u0431\u0440"
    ],
    "SHORTDAY": [
      "\u044f\u043a\u0448",
      "\u0434\u0443\u0448",
      "\u0441\u0435\u0448",
      "\u0447\u043e\u0440",
      "\u043f\u0430\u0439",
      "\u0436\u0443\u043c",
      "\u0448\u0430\u043d"
    ],
    "SHORTMONTH": [
      "\u044f\u043d\u0432",
      "\u0444\u0435\u0432",
      "\u043c\u0430\u0440",
      "\u0430\u043f\u0440",
      "\u043c\u0430\u0439",
      "\u0438\u044e\u043d",
      "\u0438\u044e\u043b",
      "\u0430\u0432\u0433",
      "\u0441\u0435\u043d",
      "\u043e\u043a\u0442",
      "\u043d\u043e\u044f",
      "\u0434\u0435\u043a"
    ],
    "STANDALONEMONTH": [
      "\u042f\u043d\u0432\u0430\u0440",
      "\u0424\u0435\u0432\u0440\u0430\u043b",
      "\u041c\u0430\u0440\u0442",
      "\u0410\u043f\u0440\u0435\u043b",
      "\u041c\u0430\u0439",
      "\u0418\u044e\u043d",
      "\u0418\u044e\u043b",
      "\u0410\u0432\u0433\u0443\u0441\u0442",
      "\u0421\u0435\u043d\u0442\u044f\u0431\u0440",
      "\u041e\u043a\u0442\u044f\u0431\u0440",
      "\u041d\u043e\u044f\u0431\u0440",
      "\u0414\u0435\u043a\u0430\u0431\u0440"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, dd MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "d MMM, y HH:mm:ss",
    "mediumDate": "d MMM, y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "so\u02bcm",
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
        "maxFrac": 0,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "uz-cyrl-uz",
  "localeID": "uz_Cyrl_UZ",
  "pluralCat": function(n, opt_precision) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
