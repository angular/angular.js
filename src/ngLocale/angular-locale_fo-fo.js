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
      "um fyrrapartur",
      "um seinnapartur"
    ],
    "DAY": [
      "sunnudagur",
      "m\u00e1nadagur",
      "t\u00fdsdagur",
      "mikudagur",
      "h\u00f3sdagur",
      "fr\u00edggjadagur",
      "leygardagur"
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
      "januar",
      "februar",
      "mars",
      "apr\u00edl",
      "mai",
      "juni",
      "juli",
      "august",
      "september",
      "oktober",
      "november",
      "desember"
    ],
    "SHORTDAY": [
      "sun",
      "m\u00e1n",
      "t\u00fds",
      "mik",
      "h\u00f3s",
      "fr\u00ed",
      "ley"
    ],
    "SHORTMONTH": [
      "jan",
      "feb",
      "mar",
      "apr",
      "mai",
      "jun",
      "jul",
      "aug",
      "sep",
      "okt",
      "nov",
      "des"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE dd MMMM y",
    "longDate": "d. MMM y",
    "medium": "dd-MM-y HH:mm:ss",
    "mediumDate": "dd-MM-y",
    "mediumTime": "HH:mm:ss",
    "short": "dd-MM-yy HH:mm",
    "shortDate": "dd-MM-yy",
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "fo-fo",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
