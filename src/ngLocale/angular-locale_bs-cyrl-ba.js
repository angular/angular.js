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
      "\u043f\u0440\u0435 \u043f\u043e\u0434\u043d\u0435",
      "\u043f\u043e\u043f\u043e\u0434\u043d\u0435"
    ],
    "DAY": [
      "\u043d\u0435\u0434\u0435\u0459\u0430",
      "\u043f\u043e\u043d\u0435\u0434\u0435\u0459\u0430\u043a",
      "\u0443\u0442\u043e\u0440\u0430\u043a",
      "\u0441\u0440\u0438\u0458\u0435\u0434\u0430",
      "\u0447\u0435\u0442\u0432\u0440\u0442\u0430\u043a",
      "\u043f\u0435\u0442\u0430\u043a",
      "\u0441\u0443\u0431\u043e\u0442\u0430"
    ],
    "MONTH": [
      "\u0458\u0430\u043d\u0443\u0430\u0440",
      "\u0444\u0435\u0431\u0440\u0443\u0430\u0440",
      "\u043c\u0430\u0440\u0442",
      "\u0430\u043f\u0440\u0438\u043b",
      "\u043c\u0430\u0458",
      "\u0458\u0443\u043d\u0438",
      "\u0458\u0443\u043b\u0438",
      "\u0430\u0432\u0433\u0443\u0441\u0442",
      "\u0441\u0435\u043f\u0442\u0435\u043c\u0431\u0430\u0440",
      "\u043e\u043a\u0442\u043e\u0431\u0430\u0440",
      "\u043d\u043e\u0432\u0435\u043c\u0431\u0430\u0440",
      "\u0434\u0435\u0446\u0435\u043c\u0431\u0430\u0440"
    ],
    "SHORTDAY": [
      "\u043d\u0435\u0434",
      "\u043f\u043e\u043d",
      "\u0443\u0442\u043e",
      "\u0441\u0440\u0438",
      "\u0447\u0435\u0442",
      "\u043f\u0435\u0442",
      "\u0441\u0443\u0431"
    ],
    "SHORTMONTH": [
      "\u0458\u0430\u043d",
      "\u0444\u0435\u0431",
      "\u043c\u0430\u0440",
      "\u0430\u043f\u0440",
      "\u043c\u0430\u0458",
      "\u0458\u0443\u043d",
      "\u0458\u0443\u043b",
      "\u0430\u0432\u0433",
      "\u0441\u0435\u043f",
      "\u043e\u043a\u0442",
      "\u043d\u043e\u0432",
      "\u0434\u0435\u0446"
    ],
    "fullDate": "EEEE, dd. MMMM y.",
    "longDate": "dd. MMMM y.",
    "medium": "dd.MM.y. HH:mm:ss",
    "mediumDate": "dd.MM.y.",
    "mediumTime": "HH:mm:ss",
    "short": "d.M.yy. HH:mm",
    "shortDate": "d.M.yy.",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "KM",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
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
  "id": "bs-cyrl-ba",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
