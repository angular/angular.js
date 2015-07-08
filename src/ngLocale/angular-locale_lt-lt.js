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
      "prie\u0161piet",
      "popiet"
    ],
    "DAY": [
      "sekmadienis",
      "pirmadienis",
      "antradienis",
      "tre\u010diadienis",
      "ketvirtadienis",
      "penktadienis",
      "\u0161e\u0161tadienis"
    ],
    "ERANAMES": [
      "prie\u0161 Krist\u0173",
      "po Kristaus"
    ],
    "ERAS": [
      "pr. Kr.",
      "po Kr."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "sausio",
      "vasario",
      "kovo",
      "baland\u017eio",
      "gegu\u017e\u0117s",
      "bir\u017eelio",
      "liepos",
      "rugpj\u016b\u010dio",
      "rugs\u0117jo",
      "spalio",
      "lapkri\u010dio",
      "gruod\u017eio"
    ],
    "SHORTDAY": [
      "sk",
      "pr",
      "an",
      "tr",
      "kt",
      "pn",
      "\u0161t"
    ],
    "SHORTMONTH": [
      "saus.",
      "vas.",
      "kov.",
      "bal.",
      "geg.",
      "bir\u017e.",
      "liep.",
      "rugp.",
      "rugs.",
      "spal.",
      "lapkr.",
      "gruod."
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "y 'm'. MMMM d 'd'., EEEE",
    "longDate": "y 'm'. MMMM d 'd'.",
    "medium": "y-MM-dd HH:mm:ss",
    "mediumDate": "y-MM-dd",
    "mediumTime": "HH:mm:ss",
    "short": "y-MM-dd HH:mm",
    "shortDate": "y-MM-dd",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
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
  "id": "lt-lt",
  "pluralCat": function(n, opt_precision) {  var vf = getVF(n, opt_precision);  if (n % 10 == 1 && (n % 100 < 11 || n % 100 > 19)) {    return PLURAL_CATEGORY.ONE;  }  if (n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 11 || n % 100 > 19)) {    return PLURAL_CATEGORY.FEW;  }  if (vf.f != 0) {    return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
