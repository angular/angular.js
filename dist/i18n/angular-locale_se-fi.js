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
      "i\u0111itbeaivet",
      "eahketbeaivet"
    ],
    "DAY": [
      "aejlege",
      "m\u00e5anta",
      "d\u00e4jsta",
      "gaskevahkoe",
      "d\u00e5arsta",
      "bearjadahke",
      "laavadahke"
    ],
    "ERANAMES": [
      "ovdal Kristtusa",
      "ma\u014b\u014bel Kristtusa"
    ],
    "ERAS": [
      "o.Kr.",
      "m.Kr."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "o\u0111\u0111ajagem\u00e1nnu",
      "guovvam\u00e1nnu",
      "njuk\u010dam\u00e1nnu",
      "cuo\u014bom\u00e1nnu",
      "miessem\u00e1nnu",
      "geassem\u00e1nnu",
      "suoidnem\u00e1nnu",
      "borgem\u00e1nnu",
      "\u010dak\u010dam\u00e1nnu",
      "golggotm\u00e1nnu",
      "sk\u00e1bmam\u00e1nnu",
      "juovlam\u00e1nnu"
    ],
    "SHORTDAY": [
      "sotn",
      "vuos",
      "ma\u014b",
      "gask",
      "duor",
      "bear",
      "l\u00e1v"
    ],
    "SHORTMONTH": [
      "o\u0111\u0111ajage",
      "guovva",
      "njuk\u010da",
      "cuo\u014bo",
      "miesse",
      "geasse",
      "suoidne",
      "borge",
      "\u010dak\u010da",
      "golggot",
      "sk\u00e1bma",
      "juovla"
    ],
    "STANDALONEMONTH": [
      "o\u0111\u0111ajagem\u00e1nnu",
      "guovvam\u00e1nnu",
      "njuk\u010dam\u00e1nnu",
      "cuo\u014bom\u00e1nnu",
      "miessem\u00e1nnu",
      "geassem\u00e1nnu",
      "suoidnem\u00e1nnu",
      "borgem\u00e1nnu",
      "\u010dak\u010dam\u00e1nnu",
      "golggotm\u00e1nnu",
      "sk\u00e1bmam\u00e1nnu",
      "juovlam\u00e1nnu"
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
  "id": "se-fi",
  "localeID": "se_FI",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
