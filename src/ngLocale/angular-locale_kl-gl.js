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
      "ulloqeqqata-tungaa",
      "ulloqeqqata-kingorna"
    ],
    "DAY": [
      "sabaat",
      "ataasinngorneq",
      "marlunngorneq",
      "pingasunngorneq",
      "sisamanngorneq",
      "tallimanngorneq",
      "arfininngorneq"
    ],
    "ERANAMES": [
      "Kristusip inunngornerata siornagut",
      "Kristusip inunngornerata kingornagut"
    ],
    "ERAS": [
      "Kr.in.si.",
      "Kr.in.king."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "januari",
      "februari",
      "martsi",
      "aprili",
      "maji",
      "juni",
      "juli",
      "augustusi",
      "septemberi",
      "oktoberi",
      "novemberi",
      "decemberi"
    ],
    "SHORTDAY": [
      "sab",
      "ata",
      "mar",
      "pin",
      "sis",
      "tal",
      "arf"
    ],
    "SHORTMONTH": [
      "jan",
      "feb",
      "mar",
      "apr",
      "maj",
      "jun",
      "jul",
      "aug",
      "sep",
      "okt",
      "nov",
      "dec"
    ],
    "STANDALONEMONTH": [
      "januari",
      "februari",
      "martsi",
      "aprili",
      "maji",
      "juni",
      "juli",
      "augustusi",
      "septemberi",
      "oktoberi",
      "novemberi",
      "decemberi"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE dd MMMM y",
    "longDate": "dd MMMM y",
    "medium": "MMM dd, y h:mm:ss a",
    "mediumDate": "MMM dd, y",
    "mediumTime": "h:mm:ss a",
    "short": "y-MM-dd h:mm a",
    "shortDate": "y-MM-dd",
    "shortTime": "h:mm a"
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
  "id": "kl-gl",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
