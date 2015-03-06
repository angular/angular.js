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
      "posz.",
      "b\u00fcz."
    ],
    "DAY": [
      "sudel",
      "mudel",
      "tudel",
      "vedel",
      "d\u00f6del",
      "fridel",
      "z\u00e4del"
    ],
    "ERANAMES": [
      "b. t. kr.",
      "p. t. kr."
    ],
    "ERAS": [
      "b. t. kr.",
      "p. t. kr."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "janul",
      "febul",
      "m\u00e4zil",
      "prilul",
      "mayul",
      "yunul",
      "yulul",
      "gustul",
      "setul",
      "tobul",
      "novul",
      "dekul"
    ],
    "SHORTDAY": [
      "su.",
      "mu.",
      "tu.",
      "ve.",
      "d\u00f6.",
      "fr.",
      "z\u00e4."
    ],
    "SHORTMONTH": [
      "jan",
      "feb",
      "m\u00e4z",
      "prl",
      "may",
      "yun",
      "yul",
      "gst",
      "set",
      "ton",
      "nov",
      "dek"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "y MMMMa 'd'. d'id'",
    "longDate": "y MMMM d",
    "medium": "y MMM. d HH:mm:ss",
    "mediumDate": "y MMM. d",
    "mediumTime": "HH:mm:ss",
    "short": "y-MM-dd HH:mm",
    "shortDate": "y-MM-dd",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "$",
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
  "id": "vo-001",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
