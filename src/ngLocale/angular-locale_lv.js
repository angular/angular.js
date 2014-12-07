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
      "priek\u0161pusdien\u0101",
      "p\u0113cpusdien\u0101"
    ],
    "DAY": [
      "sv\u0113tdiena",
      "pirmdiena",
      "otrdiena",
      "tre\u0161diena",
      "ceturtdiena",
      "piektdiena",
      "sestdiena"
    ],
    "MONTH": [
      "janv\u0101ris",
      "febru\u0101ris",
      "marts",
      "apr\u012blis",
      "maijs",
      "j\u016bnijs",
      "j\u016blijs",
      "augusts",
      "septembris",
      "oktobris",
      "novembris",
      "decembris"
    ],
    "SHORTDAY": [
      "Sv",
      "Pr",
      "Ot",
      "Tr",
      "Ce",
      "Pk",
      "Se"
    ],
    "SHORTMONTH": [
      "janv.",
      "febr.",
      "marts",
      "apr.",
      "maijs",
      "j\u016bn.",
      "j\u016bl.",
      "aug.",
      "sept.",
      "okt.",
      "nov.",
      "dec."
    ],
    "fullDate": "EEEE, y. 'gada' d. MMMM",
    "longDate": "y. 'gada' d. MMMM",
    "medium": "y. 'gada' d. MMM HH:mm:ss",
    "mediumDate": "y. 'gada' d. MMM",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
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
        "gSize": 0,
        "lgSize": 0,
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
  "id": "lv",
  "pluralCat": function(n, opt_precision) {  var vf = getVF(n, opt_precision);  if (n % 10 == 0 || n % 100 >= 11 && n % 100 <= 19 || vf.v == 2 && vf.f % 100 >= 11 && vf.f % 100 <= 19) {    return PLURAL_CATEGORY.ZERO;  }  if (n % 10 == 1 && n % 100 != 11 || vf.v == 2 && vf.f % 10 == 1 && vf.f % 100 != 11 || vf.v != 2 && vf.f % 10 == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
