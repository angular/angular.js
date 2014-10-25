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
      "\u014bdi",
      "\u0263etr\u0254"
    ],
    "DAY": [
      "k\u0254si\u0256a",
      "dzo\u0256a",
      "bla\u0256a",
      "ku\u0256a",
      "yawo\u0256a",
      "fi\u0256a",
      "memle\u0256a"
    ],
    "MONTH": [
      "dzove",
      "dzodze",
      "tedoxe",
      "af\u0254f\u0129e",
      "dama",
      "masa",
      "siaml\u0254m",
      "deasiamime",
      "any\u0254ny\u0254",
      "kele",
      "ade\u025bmekp\u0254xe",
      "dzome"
    ],
    "SHORTDAY": [
      "k\u0254s",
      "dzo",
      "bla",
      "ku\u0256",
      "yaw",
      "fi\u0256",
      "mem"
    ],
    "SHORTMONTH": [
      "dzv",
      "dzd",
      "ted",
      "af\u0254",
      "dam",
      "mas",
      "sia",
      "dea",
      "any",
      "kel",
      "ade",
      "dzm"
    ],
    "fullDate": "EEEE, MMMM d 'lia' y",
    "longDate": "MMMM d 'lia' y",
    "medium": "MMM d 'lia', y a 'ga' h:mm:ss",
    "mediumDate": "MMM d 'lia', y",
    "mediumTime": "a 'ga' h:mm:ss",
    "short": "M/d/yy a 'ga' h:mm",
    "shortDate": "M/d/yy",
    "shortTime": "a 'ga' h:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "CFA",
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "ee-tg",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
