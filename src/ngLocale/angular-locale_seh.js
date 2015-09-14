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
      "Dimingu",
      "Chiposi",
      "Chipiri",
      "Chitatu",
      "Chinai",
      "Chishanu",
      "Sabudu"
    ],
    "ERANAMES": [
      "Antes de Cristo",
      "Anno Domini"
    ],
    "ERAS": [
      "AC",
      "AD"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Janeiro",
      "Fevreiro",
      "Marco",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Augusto",
      "Setembro",
      "Otubro",
      "Novembro",
      "Decembro"
    ],
    "SHORTDAY": [
      "Dim",
      "Pos",
      "Pir",
      "Tat",
      "Nai",
      "Sha",
      "Sab"
    ],
    "SHORTMONTH": [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Aug",
      "Set",
      "Otu",
      "Nov",
      "Dec"
    ],
    "STANDALONEMONTH": [
      "Janeiro",
      "Fevreiro",
      "Marco",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Augusto",
      "Setembro",
      "Otubro",
      "Novembro",
      "Decembro"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d 'de' MMMM 'de' y",
    "longDate": "d 'de' MMMM 'de' y",
    "medium": "d 'de' MMM 'de' y HH:mm:ss",
    "mediumDate": "d 'de' MMM 'de' y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/y HH:mm",
    "shortDate": "d/M/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "MTn",
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
        "negSuf": "\u00a4",
        "posPre": "",
        "posSuf": "\u00a4"
      }
    ]
  },
  "id": "seh",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
