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
      "subaka",
      "kikii\u0257e"
    ],
    "DAY": [
      "dewo",
      "aa\u0253nde",
      "mawbaare",
      "njeslaare",
      "naasaande",
      "mawnde",
      "hoore-biir"
    ],
    "ERANAMES": [
      "Hade Iisa",
      "Caggal Iisa"
    ],
    "ERAS": [
      "H-I",
      "C-I"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "siilo",
      "colte",
      "mbooy",
      "see\u0257to",
      "duujal",
      "korse",
      "morso",
      "juko",
      "siilto",
      "yarkomaa",
      "jolal",
      "bowte"
    ],
    "SHORTDAY": [
      "dew",
      "aa\u0253",
      "maw",
      "nje",
      "naa",
      "mwd",
      "hbi"
    ],
    "SHORTMONTH": [
      "sii",
      "col",
      "mbo",
      "see",
      "duu",
      "kor",
      "mor",
      "juk",
      "slt",
      "yar",
      "jol",
      "bow"
    ],
    "STANDALONEMONTH": [
      "siilo",
      "colte",
      "mbooy",
      "see\u0257to",
      "duujal",
      "korse",
      "morso",
      "juko",
      "siilto",
      "yarkomaa",
      "jolal",
      "bowte"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM, y HH:mm:ss",
    "mediumDate": "d MMM, y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/y HH:mm",
    "shortDate": "d/M/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "CFA",
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
        "maxFrac": 0,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "ff-sn",
  "localeID": "ff_SN",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
