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
      "saaku",
      "carra"
    ],
    "DAY": [
      "Acaada",
      "Etleeni",
      "Talaata",
      "Arbaqa",
      "Kamiisi",
      "Gumqata",
      "Sabti"
    ],
    "MONTH": [
      "Qunxa Garablu",
      "Kudo",
      "Ciggilta Kudo",
      "Agda Baxis",
      "Caxah Alsa",
      "Qasa Dirri",
      "Qado Dirri",
      "Leqeeni",
      "Waysu",
      "Diteli",
      "Ximoli",
      "Kaxxa Garablu"
    ],
    "SHORTDAY": [
      "Aca",
      "Etl",
      "Tal",
      "Arb",
      "Kam",
      "Gum",
      "Sab"
    ],
    "SHORTMONTH": [
      "Qun",
      "Nah",
      "Cig",
      "Agd",
      "Cax",
      "Qas",
      "Qad",
      "Leq",
      "Way",
      "Dit",
      "Xim",
      "Kax"
    ],
    "fullDate": "EEEE, MMMM dd, y",
    "longDate": "dd MMMM y",
    "medium": "dd-MMM-y h:mm:ss a",
    "mediumDate": "dd-MMM-y",
    "mediumTime": "h:mm:ss a",
    "short": "dd/MM/yy h:mm a",
    "shortDate": "dd/MM/yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Fdj",
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
  "id": "aa-dj",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);