'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
function getDecimals(n) {
  n = n + '';
  var i = n.indexOf('.');
  return (i == -1) ? 0 : n.length - i - 1;
}

function getVF(n, opt_precision) {
  var v = opt_precision;

  if (undefined === v) {
    v = Math.min(getDecimals(n), 3);
  }

  var base = Math.pow(10, v);
  var f = ((n * base) | 0) % base;
  return {v: v, f: f};
}

$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "AM",
      "PM"
    ],
    "DAY": [
      "\u043a\u04c0\u0438\u0440\u0430\u043d\u0430\u043d \u0434\u0435",
      "\u043e\u0440\u0448\u043e\u0442\u0430\u043d \u0434\u0435",
      "\u0448\u0438\u043d\u0430\u0440\u0438\u043d \u0434\u0435",
      "\u043a\u0445\u0430\u0430\u0440\u0438\u043d \u0434\u0435",
      "\u0435\u0430\u0440\u0438\u043d \u0434\u0435",
      "\u043f\u04c0\u0435\u0440\u0430\u0441\u043a\u0430\u043d \u0434\u0435",
      "\u0448\u043e\u0442 \u0434\u0435"
    ],
    "ERANAMES": [
      "BCE",
      "CE"
    ],
    "ERAS": [
      "BCE",
      "CE"
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
      "\u043a\u04c0\u0438\u0440\u0430\u043d\u0430\u043d \u0434\u0435",
      "\u043e\u0440\u0448\u043e\u0442\u0430\u043d \u0434\u0435",
      "\u0448\u0438\u043d\u0430\u0440\u0438\u043d \u0434\u0435",
      "\u043a\u0445\u0430\u0430\u0440\u0438\u043d \u0434\u0435",
      "\u0435\u0430\u0440\u0438\u043d \u0434\u0435",
      "\u043f\u04c0\u0435\u0440\u0430\u0441\u043a\u0430\u043d \u0434\u0435",
      "\u0448\u043e\u0442 \u0434\u0435"
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
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "y MMMM d, EEEE",
    "longDate": "y MMMM d",
    "medium": "y MMM d HH:mm:ss",
    "mediumDate": "y MMM d",
    "mediumTime": "HH:mm:ss",
    "short": "y-MM-dd HH:mm",
    "shortDate": "y-MM-dd",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20bd",
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
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "ce-ru",
  "localeID": "ce_RU",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
