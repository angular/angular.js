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
      "\u0414\u041f",
      "\u041f\u041f"
    ],
    "DAY": [
      "\u043d\u0435\u0434\u0463\u0301\u043b\u0467",
      "\u043f\u043e\u043d\u0435\u0434\u0463\u0301\u043b\u044c\u043d\u0438\u043a\u044a",
      "\u0432\u0442\u043e\u0301\u0440\u043d\u0438\u043a\u044a",
      "\u0441\u0440\u0435\u0434\u0430\u0300",
      "\u0447\u0435\u0442\u0432\u0435\u0440\u0442\u043e\u0301\u043a\u044a",
      "\u043f\u0467\u0442\u043e\u0301\u043a\u044a",
      "\u0441\ua64b\u0431\u0431\u0461\u0301\u0442\u0430"
    ],
    "ERANAMES": [
      "\u043f\u0440\u0435\u0301\u0434\u044a \u0440.\u00a0\u0445.",
      "\u043f\u043e \u0440.\u00a0\u0445."
    ],
    "ERAS": [
      "\u043f\u0440\u0435\u0301\u0434\u044a \u0440.\u00a0\u0445.",
      "\u043f\u043e \u0440.\u00a0\u0445."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "\u0456\u0486\u0430\u043d\u043d\ua64b\u0430\u0301\u0440\u0457\u0430",
      "\u0444\u0435\u0432\u0440\ua64b\u0430\u0301\u0440\u0457\u0430",
      "\u043c\u0430\u0301\u0440\u0442\u0430",
      "\u0430\u0486\u043f\u0440\u0456\u0301\u043b\u043b\u0457\u0430",
      "\u043c\u0430\u0301\u0457\u0430",
      "\u0456\u0486\ua64b\u0301\u043d\u0457\u0430",
      "\u0456\u0486\ua64b\u0301\u043b\u0457\u0430",
      "\u0430\u0486\u0301\u0475\u0433\ua64b\u0441\u0442\u0430",
      "\u0441\u0435\u043f\u0442\u0435\u0301\u043c\u0432\u0440\u0457\u0430",
      "\u047b\u0486\u043a\u0442\u0461\u0301\u0432\u0440\u0457\u0430",
      "\u043d\u043e\u0435\u0301\u043c\u0432\u0440\u0457\u0430",
      "\u0434\u0435\u043a\u0435\u0301\u043c\u0432\u0440\u0457\u0430"
    ],
    "SHORTDAY": [
      "\u043d\u0434\u2de7\u0487\u0467",
      "\u043f\u043d\u2de3\u0435",
      "\u0432\u0442\u043e\u2dec\u0487",
      "\u0441\u0440\u2de3\u0435",
      "\u0447\u0435\u2de6\u0487",
      "\u043f\u0467\u2de6\u0487",
      "\u0441\ua64b\u2de0\u0487"
    ],
    "SHORTMONTH": [
      "\u0456\u0486\u0430\u2de9\u0487",
      "\u0444\u0435\u2de1\u0487",
      "\u043c\u0430\u2dec\u0487",
      "\u0430\u0486\u043f\u2dec\u0487",
      "\u043c\u0430\ua675",
      "\u0456\u0486\ua64b\u2de9\u0487",
      "\u0456\u0486\ua64b\u2de7\u0487",
      "\u0430\u0486\u0301\u0475\u2de2\u0487",
      "\u0441\u0435\u2deb\u0487",
      "\u047b\u0486\u043a\u2dee",
      "\u043d\u043e\u0435\u2de8",
      "\u0434\u0435\u2de6\u0487"
    ],
    "STANDALONEMONTH": [
      "\u0456\u0486\u0430\u043d\u043d\ua64b\u0430\u0301\u0440\u0457\u0439",
      "\u0444\u0435\u0432\u0440\ua64b\u0430\u0301\u0440\u0457\u0439",
      "\u043c\u0430\u0301\u0440\u0442\u044a",
      "\u0430\u0486\u043f\u0440\u0456\u0301\u043b\u043b\u0457\u0439",
      "\u043c\u0430\u0301\u0457\u0439",
      "\u0456\u0486\ua64b\u0301\u043d\u0457\u0439",
      "\u0456\u0486\ua64b\u0301\u043b\u0457\u0439",
      "\u0430\u0486\u0301\u0475\u0433\ua64b\u0441\u0442\u044a",
      "\u0441\u0435\u043f\u0442\u0435\u0301\u043c\u0432\u0440\u0457\u0439",
      "\u047b\u0486\u043a\u0442\u0461\u0301\u0432\u0440\u0457\u0439",
      "\u043d\u043e\u0435\u0301\u043c\u0432\u0440\u0457\u0439",
      "\u0434\u0435\u043a\u0435\u0301\u043c\u0432\u0440\u0457\u0439"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM '\u043b'. y.",
    "longDate": "y MMMM d",
    "medium": "y MMM d HH:mm:ss",
    "mediumDate": "y MMM d",
    "mediumTime": "HH:mm:ss",
    "short": "y.MM.dd HH:mm",
    "shortDate": "y.MM.dd",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20bd",
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
  "id": "cu-ru",
  "localeID": "cu_RU",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
