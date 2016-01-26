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
      "AM",
      "PM"
    ],
    "DAY": [
      "Sonto",
      "Mvulo",
      "Sibili",
      "Sithathu",
      "Sine",
      "Sihlanu",
      "Mgqibelo"
    ],
    "ERANAMES": [
      "UKristo angakabuyi",
      "Ukristo ebuyile"
    ],
    "ERAS": [
      "BC",
      "AD"
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "Zibandlela",
      "Nhlolanja",
      "Mbimbitho",
      "Mabasa",
      "Nkwenkwezi",
      "Nhlangula",
      "Ntulikazi",
      "Ncwabakazi",
      "Mpandula",
      "Mfumfu",
      "Lwezi",
      "Mpalakazi"
    ],
    "SHORTDAY": [
      "Son",
      "Mvu",
      "Sib",
      "Sit",
      "Sin",
      "Sih",
      "Mgq"
    ],
    "SHORTMONTH": [
      "Zib",
      "Nhlo",
      "Mbi",
      "Mab",
      "Nkw",
      "Nhla",
      "Ntu",
      "Ncw",
      "Mpan",
      "Mfu",
      "Lwe",
      "Mpal"
    ],
    "STANDALONEMONTH": [
      "Zibandlela",
      "Nhlolanja",
      "Mbimbitho",
      "Mabasa",
      "Nkwenkwezi",
      "Nhlangula",
      "Ntulikazi",
      "Ncwabakazi",
      "Mpandula",
      "Mfumfu",
      "Lwezi",
      "Mpalakazi"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "dd/MM/y h:mm a",
    "shortDate": "dd/MM/y",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "$",
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
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "nd",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
