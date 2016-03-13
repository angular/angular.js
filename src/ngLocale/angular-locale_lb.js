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
      "moies",
      "nom\u00ebttes"
    ],
    "DAY": [
      "Sonndeg",
      "M\u00e9indeg",
      "D\u00ebnschdeg",
      "M\u00ebttwoch",
      "Donneschdeg",
      "Freideg",
      "Samschdeg"
    ],
    "ERANAMES": [
      "v. Chr.",
      "n. Chr."
    ],
    "ERAS": [
      "v. Chr.",
      "n. Chr."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Januar",
      "Februar",
      "M\u00e4erz",
      "Abr\u00ebll",
      "Mee",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember"
    ],
    "SHORTDAY": [
      "Son.",
      "M\u00e9i.",
      "D\u00ebn.",
      "M\u00ebt.",
      "Don.",
      "Fre.",
      "Sam."
    ],
    "SHORTMONTH": [
      "Jan.",
      "Feb.",
      "M\u00e4e.",
      "Abr.",
      "Mee",
      "Juni",
      "Juli",
      "Aug.",
      "Sep.",
      "Okt.",
      "Nov.",
      "Dez."
    ],
    "STANDALONEMONTH": [
      "Januar",
      "Februar",
      "M\u00e4erz",
      "Abr\u00ebll",
      "Mee",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember"
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
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
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
  "id": "lb",
  "localeID": "lb",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
