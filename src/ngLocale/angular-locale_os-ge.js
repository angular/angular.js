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
      "\u04d5\u043c\u0431\u0438\u0441\u0431\u043e\u043d\u044b \u0440\u0430\u0437\u043c\u04d5",
      "\u04d5\u043c\u0431\u0438\u0441\u0431\u043e\u043d\u044b \u0444\u04d5\u0441\u0442\u04d5"
    ],
    "DAY": [
      "\u0445\u0443\u044b\u0446\u0430\u0443\u0431\u043e\u043d",
      "\u043a\u044a\u0443\u044b\u0440\u0438\u0441\u04d5\u0440",
      "\u0434\u044b\u0446\u0446\u04d5\u0433",
      "\u04d5\u0440\u0442\u044b\u0446\u0446\u04d5\u0433",
      "\u0446\u044b\u043f\u043f\u04d5\u0440\u04d5\u043c",
      "\u043c\u0430\u0439\u0440\u04d5\u043c\u0431\u043e\u043d",
      "\u0441\u0430\u0431\u0430\u0442"
    ],
    "ERANAMES": [
      "\u043d.\u0434.\u0430.",
      "\u043d.\u0434."
    ],
    "ERAS": [
      "\u043d.\u0434.\u0430.",
      "\u043d.\u0434."
    ],
    "MONTH": [
      "\u044f\u043d\u0432\u0430\u0440\u044b",
      "\u0444\u0435\u0432\u0440\u0430\u043b\u044b",
      "\u043c\u0430\u0440\u0442\u044a\u0438\u0439\u044b",
      "\u0430\u043f\u0440\u0435\u043b\u044b",
      "\u043c\u0430\u0439\u044b",
      "\u0438\u044e\u043d\u044b",
      "\u0438\u044e\u043b\u044b",
      "\u0430\u0432\u0433\u0443\u0441\u0442\u044b",
      "\u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044b",
      "\u043e\u043a\u0442\u044f\u0431\u0440\u044b",
      "\u043d\u043e\u044f\u0431\u0440\u044b",
      "\u0434\u0435\u043a\u0430\u0431\u0440\u044b"
    ],
    "SHORTDAY": [
      "\u0445\u0446\u0431",
      "\u043a\u0440\u0441",
      "\u0434\u0446\u0433",
      "\u04d5\u0440\u0442",
      "\u0446\u043f\u0440",
      "\u043c\u0440\u0431",
      "\u0441\u0431\u0442"
    ],
    "SHORTMONTH": [
      "\u044f\u043d\u0432.",
      "\u0444\u0435\u0432.",
      "\u043c\u0430\u0440.",
      "\u0430\u043f\u0440.",
      "\u043c\u0430\u044f",
      "\u0438\u044e\u043d\u044b",
      "\u0438\u044e\u043b\u044b",
      "\u0430\u0432\u0433.",
      "\u0441\u0435\u043d.",
      "\u043e\u043a\u0442.",
      "\u043d\u043e\u044f.",
      "\u0434\u0435\u043a."
    ],
    "fullDate": "EEEE, d MMMM, y '\u0430\u0437'",
    "longDate": "d MMMM, y '\u0430\u0437'",
    "medium": "dd MMM y '\u0430\u0437' HH:mm:ss",
    "mediumDate": "dd MMM y '\u0430\u0437'",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "GEL",
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
        "negPre": "\u00a4\u00a0-",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "os-ge",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
