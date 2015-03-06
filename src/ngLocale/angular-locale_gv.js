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
      "a.m.",
      "p.m."
    ],
    "DAY": [
      "Jedoonee",
      "Jelhein",
      "Jemayrt",
      "Jercean",
      "Jerdein",
      "Jeheiney",
      "Jesarn"
    ],
    "ERANAMES": [
      "RC",
      "AD"
    ],
    "ERAS": [
      "RC",
      "AD"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Jerrey-geuree",
      "Toshiaght-arree",
      "Mayrnt",
      "Averil",
      "Boaldyn",
      "Mean-souree",
      "Jerrey-souree",
      "Luanistyn",
      "Mean-fouyir",
      "Jerrey-fouyir",
      "Mee Houney",
      "Mee ny Nollick"
    ],
    "SHORTDAY": [
      "Jed",
      "Jel",
      "Jem",
      "Jerc",
      "Jerd",
      "Jeh",
      "Jes"
    ],
    "SHORTMONTH": [
      "J-guer",
      "T-arree",
      "Mayrnt",
      "Avrril",
      "Boaldyn",
      "M-souree",
      "J-souree",
      "Luanistyn",
      "M-fouyir",
      "J-fouyir",
      "M.Houney",
      "M.Nollick"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE dd MMMM y",
    "longDate": "dd MMMM y",
    "medium": "MMM dd, y HH:mm:ss",
    "mediumDate": "MMM dd, y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u00a3",
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
  "id": "gv",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
