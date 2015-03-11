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
      "Uhr v\u00f6rmiddaachs",
      "Uhr nommendaachs"
    ],
    "DAY": [
      "Sunndaach",
      "Moondaach",
      "Dinnsdaach",
      "Metwoch",
      "Dunnersdaach",
      "Friidaach",
      "Samsdaach"
    ],
    "ERANAMES": [
      "v\u00fcr Chrestus",
      "noh Chrestus"
    ],
    "ERAS": [
      "v. Chr.",
      "n. Chr."
    ],
    "MONTH": [
      "Jannewa",
      "F\u00e4browa",
      "M\u00e4\u00e4z",
      "Aprell",
      "M\u00e4i",
      "Juuni",
      "Juuli",
      "Oujo\u00df",
      "Sept\u00e4mber",
      "Oktoober",
      "Nov\u00e4mber",
      "Dez\u00e4mber"
    ],
    "SHORTDAY": [
      "Su.",
      "Mo.",
      "Di.",
      "Me.",
      "Du.",
      "Fr.",
      "Sa."
    ],
    "SHORTMONTH": [
      "Jan",
      "F\u00e4b",
      "M\u00e4z",
      "Apr",
      "M\u00e4i",
      "Jun",
      "Jul",
      "Ouj",
      "S\u00e4p",
      "Okt",
      "Nov",
      "Dez"
    ],
    "fullDate": "EEEE, 'd\u00e4' d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "d. MMM. y HH:mm:ss",
    "mediumDate": "d. MMM. y",
    "mediumTime": "HH:mm:ss",
    "short": "d. M. y HH:mm",
    "shortDate": "d. M. y",
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
  "id": "ksh-de",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
