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
      "pamilau",
      "pamunyi"
    ],
    "DAY": [
      "pa mulungu",
      "pa shahuviluha",
      "pa hivili",
      "pa hidatu",
      "pa hitayi",
      "pa hihanu",
      "pa shahulembela"
    ],
    "ERANAMES": [
      "Kabla ya Mtwaa",
      "Baada ya Mtwaa"
    ],
    "ERAS": [
      "KM",
      "BM"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "pa mwedzi gwa hutala",
      "pa mwedzi gwa wuvili",
      "pa mwedzi gwa wudatu",
      "pa mwedzi gwa wutai",
      "pa mwedzi gwa wuhanu",
      "pa mwedzi gwa sita",
      "pa mwedzi gwa saba",
      "pa mwedzi gwa nane",
      "pa mwedzi gwa tisa",
      "pa mwedzi gwa kumi",
      "pa mwedzi gwa kumi na moja",
      "pa mwedzi gwa kumi na mbili"
    ],
    "SHORTDAY": [
      "Mul",
      "Vil",
      "Hiv",
      "Hid",
      "Hit",
      "Hih",
      "Lem"
    ],
    "SHORTMONTH": [
      "Hut",
      "Vil",
      "Dat",
      "Tai",
      "Han",
      "Sit",
      "Sab",
      "Nan",
      "Tis",
      "Kum",
      "Kmj",
      "Kmb"
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
        "negPre": "-",
        "negSuf": "\u00a4",
        "posPre": "",
        "posSuf": "\u00a4"
      }
    ]
  },
  "id": "bez-tz",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
