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

function getWT(v, f) {
  if (f === 0) {
    return {w: 0, t: 0};
  }

  while ((f % 10) === 0) {
    f /= 10;
    v--;
  }

  return {w: v, t: f};
}

$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "f.h.",
      "e.h."
    ],
    "DAY": [
      "sunnudagur",
      "m\u00e1nudagur",
      "\u00feri\u00f0judagur",
      "mi\u00f0vikudagur",
      "fimmtudagur",
      "f\u00f6studagur",
      "laugardagur"
    ],
    "ERANAMES": [
      "fyrir Krist",
      "eftir Krist"
    ],
    "ERAS": [
      "f.Kr.",
      "e.Kr."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "jan\u00faar",
      "febr\u00faar",
      "mars",
      "apr\u00edl",
      "ma\u00ed",
      "j\u00fan\u00ed",
      "j\u00fal\u00ed",
      "\u00e1g\u00fast",
      "september",
      "okt\u00f3ber",
      "n\u00f3vember",
      "desember"
    ],
    "SHORTDAY": [
      "sun.",
      "m\u00e1n.",
      "\u00feri.",
      "mi\u00f0.",
      "fim.",
      "f\u00f6s.",
      "lau."
    ],
    "SHORTMONTH": [
      "jan.",
      "feb.",
      "mar.",
      "apr.",
      "ma\u00ed",
      "j\u00fan.",
      "j\u00fal.",
      "\u00e1g\u00fa.",
      "sep.",
      "okt.",
      "n\u00f3v.",
      "des."
    ],
    "STANDALONEMONTH": [
      "jan\u00faar",
      "febr\u00faar",
      "mars",
      "apr\u00edl",
      "ma\u00ed",
      "j\u00fan\u00ed",
      "j\u00fal\u00ed",
      "\u00e1g\u00fast",
      "september",
      "okt\u00f3ber",
      "n\u00f3vember",
      "desember"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "d. MMM y HH:mm:ss",
    "mediumDate": "d. MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "d.M.y HH:mm",
    "shortDate": "d.M.y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "kr",
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
  "id": "is",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  var wt = getWT(vf.v, vf.f);  if (wt.t == 0 && i % 10 == 1 && i % 100 != 11 || wt.t != 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
