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
      "a.g",
      "a.k"
    ],
    "DAY": [
      "tsu\u0294nts\u0268",
      "tsu\u0294ukp\u00e0",
      "tsu\u0294ugh\u0254e",
      "tsu\u0294ut\u0254\u0300ml\u00f2",
      "tsu\u0294um\u00e8",
      "tsu\u0294ugh\u0268\u0302m",
      "tsu\u0294ndz\u0268k\u0254\u0294\u0254"
    ],
    "MONTH": [
      "ndz\u0254\u0300\u014b\u0254\u0300n\u00f9m",
      "ndz\u0254\u0300\u014b\u0254\u0300k\u0197\u0300z\u00f9\u0294",
      "ndz\u0254\u0300\u014b\u0254\u0300t\u0197\u0300d\u0289\u0300gh\u00e0",
      "ndz\u0254\u0300\u014b\u0254\u0300t\u01ceaf\u0289\u0304gh\u0101",
      "ndz\u0254\u0300\u014b\u00e8s\u00e8e",
      "ndz\u0254\u0300\u014b\u0254\u0300nz\u00f9gh\u00f2",
      "ndz\u0254\u0300\u014b\u0254\u0300d\u00f9mlo",
      "ndz\u0254\u0300\u014b\u0254\u0300kw\u00eef\u0254\u0300e",
      "ndz\u0254\u0300\u014b\u0254\u0300t\u0197\u0300f\u0289\u0300gh\u00e0dzugh\u00f9",
      "ndz\u0254\u0300\u014b\u0254\u0300gh\u01d4uwel\u0254\u0300m",
      "ndz\u0254\u0300\u014b\u0254\u0300chwa\u0294\u00e0kaa wo",
      "ndz\u0254\u0300\u014b\u00e8fw\u00f2o"
    ],
    "SHORTDAY": [
      "nts",
      "kpa",
      "gh\u0254",
      "t\u0254m",
      "ume",
      "gh\u0268",
      "dzk"
    ],
    "SHORTMONTH": [
      "n\u00f9m",
      "k\u0268z",
      "t\u0268d",
      "taa",
      "see",
      "nzu",
      "dum",
      "f\u0254e",
      "dzu",
      "l\u0254m",
      "kaa",
      "fwo"
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM, y HH:mm:ss",
    "mediumDate": "d MMM, y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/y HH:mm",
    "shortDate": "d/M/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "FCFA",
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
        "negSuf": "\u00a4",
        "posPre": "",
        "posSuf": "\u00a4"
      }
    ]
  },
  "id": "agq",
  "pluralCat": function (n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);