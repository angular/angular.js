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
      "\u0434\u0430 \u043f\u0430\u043b\u0443\u0434\u043d\u044f",
      "\u043f\u0430\u0441\u043b\u044f \u043f\u0430\u043b\u0443\u0434\u043d\u044f"
    ],
    "DAY": [
      "\u043d\u044f\u0434\u0437\u0435\u043b\u044f",
      "\u043f\u0430\u043d\u044f\u0434\u0437\u0435\u043b\u0430\u043a",
      "\u0430\u045e\u0442\u043e\u0440\u0430\u043a",
      "\u0441\u0435\u0440\u0430\u0434\u0430",
      "\u0447\u0430\u0446\u0432\u0435\u0440",
      "\u043f\u044f\u0442\u043d\u0456\u0446\u0430",
      "\u0441\u0443\u0431\u043e\u0442\u0430"
    ],
    "ERANAMES": [
      "\u0434\u0430 \u043d.\u044d.",
      "\u043d.\u044d."
    ],
    "ERAS": [
      "\u0434\u0430 \u043d.\u044d.",
      "\u043d.\u044d."
    ],
    "MONTH": [
      "\u0441\u0442\u0443\u0434\u0437\u0435\u043d\u044f",
      "\u043b\u044e\u0442\u0430\u0433\u0430",
      "\u0441\u0430\u043a\u0430\u0432\u0456\u043a\u0430",
      "\u043a\u0440\u0430\u0441\u0430\u0432\u0456\u043a\u0430",
      "\u043c\u0430\u044f",
      "\u0447\u044d\u0440\u0432\u0435\u043d\u044f",
      "\u043b\u0456\u043f\u0435\u043d\u044f",
      "\u0436\u043d\u0456\u045e\u043d\u044f",
      "\u0432\u0435\u0440\u0430\u0441\u043d\u044f",
      "\u043a\u0430\u0441\u0442\u0440\u044b\u0447\u043d\u0456\u043a\u0430",
      "\u043b\u0456\u0441\u0442\u0430\u043f\u0430\u0434\u0430",
      "\u0441\u043d\u0435\u0436\u043d\u044f"
    ],
    "SHORTDAY": [
      "\u043d\u0434",
      "\u043f\u043d",
      "\u0430\u045e",
      "\u0441\u0440",
      "\u0447\u0446",
      "\u043f\u0442",
      "\u0441\u0431"
    ],
    "SHORTMONTH": [
      "\u0441\u0442\u0443",
      "\u043b\u044e\u0442",
      "\u0441\u0430\u043a",
      "\u043a\u0440\u0430",
      "\u043c\u0430\u044f",
      "\u0447\u044d\u0440",
      "\u043b\u0456\u043f",
      "\u0436\u043d\u0456",
      "\u0432\u0435\u0440",
      "\u043a\u0430\u0441",
      "\u043b\u0456\u0441",
      "\u0441\u043d\u0435"
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d.M.y HH.mm.ss",
    "mediumDate": "d.M.y",
    "mediumTime": "HH.mm.ss",
    "short": "d.M.yy HH.mm",
    "shortDate": "d.M.yy",
    "shortTime": "HH.mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "BYR",
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "be",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
