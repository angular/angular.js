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
      "Lahadi",
      "Litinin",
      "Talata",
      "Laraba",
      "Alhamis",
      "Jumma\u02bca",
      "Asabar"
    ],
    "ERANAMES": [
      "Kafin haihuwar annab",
      "Bayan haihuwar annab"
    ],
    "ERAS": [
      "KHAI",
      "BHAI"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Janairu",
      "Faburairu",
      "Maris",
      "Afirilu",
      "Mayu",
      "Yuni",
      "Yuli",
      "Agusta",
      "Satumba",
      "Oktoba",
      "Nuwamba",
      "Disamba"
    ],
    "SHORTDAY": [
      "Lh",
      "Li",
      "Ta",
      "Lr",
      "Al",
      "Ju",
      "As"
    ],
    "SHORTMONTH": [
      "Jan",
      "Fab",
      "Mar",
      "Afi",
      "May",
      "Yun",
      "Yul",
      "Agu",
      "Sat",
      "Okt",
      "Nuw",
      "Dis"
    ],
    "STANDALONEMONTH": [
      "Janairu",
      "Faburairu",
      "Maris",
      "Afirilu",
      "Mayu",
      "Yuni",
      "Yuli",
      "Agusta",
      "Satumba",
      "Oktoba",
      "Nuwamba",
      "Disamba"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "d MMM, y HH:mm:ss",
    "mediumDate": "d MMM, y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/yy HH:mm",
    "shortDate": "d/M/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20a6",
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
  "id": "ha",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
