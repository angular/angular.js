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
      "TOO",
      "MUU"
    ],
    "DAY": [
      "Jumap\u00ediri",
      "Jumat\u00e1tu",
      "Juma\u00edne",
      "Jumat\u00e1ano",
      "Alam\u00edisi",
      "Ijum\u00e1a",
      "Jumam\u00f3osi"
    ],
    "ERANAMES": [
      "K\u0268r\u0268sit\u0289 s\u0268 anavyaal",
      "K\u0268r\u0268sit\u0289 akavyaalwe"
    ],
    "ERAS": [
      "KSA",
      "KA"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "K\u0289f\u00fangat\u0268",
      "K\u0289naan\u0268",
      "K\u0289keenda",
      "Kwiikumi",
      "Kwiinyamb\u00e1la",
      "Kwiidwaata",
      "K\u0289m\u0289\u0289nch\u0268",
      "K\u0289v\u0268\u0268r\u0268",
      "K\u0289saat\u0289",
      "Kwiinyi",
      "K\u0289saano",
      "K\u0289sasat\u0289"
    ],
    "SHORTDAY": [
      "P\u00edili",
      "T\u00e1atu",
      "\u00cdne",
      "T\u00e1ano",
      "Alh",
      "Ijm",
      "M\u00f3osi"
    ],
    "SHORTMONTH": [
      "F\u00fangat\u0268",
      "Naan\u0268",
      "Keenda",
      "Ik\u00fami",
      "Inyambala",
      "Idwaata",
      "M\u0289\u0289nch\u0268",
      "V\u0268\u0268r\u0268",
      "Saat\u0289",
      "Inyi",
      "Saano",
      "Sasat\u0289"
    ],
    "STANDALONEMONTH": [
      "K\u0289f\u00fangat\u0268",
      "K\u0289naan\u0268",
      "K\u0289keenda",
      "Kwiikumi",
      "Kwiinyamb\u00e1la",
      "Kwiidwaata",
      "K\u0289m\u0289\u0289nch\u0268",
      "K\u0289v\u0268\u0268r\u0268",
      "K\u0289saat\u0289",
      "Kwiinyi",
      "K\u0289saano",
      "K\u0289sasat\u0289"
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
    "CURRENCY_SYM": "TSh",
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
        "negPre": "-\u00a4\u00a0",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "lag-tz",
  "localeID": "lag_TZ",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
