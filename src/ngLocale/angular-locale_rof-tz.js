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
      "kang\u2019ama",
      "kingoto"
    ],
    "DAY": [
      "Ijumapili",
      "Ijumatatu",
      "Ijumanne",
      "Ijumatano",
      "Alhamisi",
      "Ijumaa",
      "Ijumamosi"
    ],
    "ERANAMES": [
      "Kabla ya Mayesu",
      "Baada ya Mayesu"
    ],
    "ERAS": [
      "KM",
      "BM"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Mweri wa kwanza",
      "Mweri wa kaili",
      "Mweri wa katatu",
      "Mweri wa kaana",
      "Mweri wa tanu",
      "Mweri wa sita",
      "Mweri wa saba",
      "Mweri wa nane",
      "Mweri wa tisa",
      "Mweri wa ikumi",
      "Mweri wa ikumi na moja",
      "Mweri wa ikumi na mbili"
    ],
    "SHORTDAY": [
      "Ijp",
      "Ijt",
      "Ijn",
      "Ijtn",
      "Alh",
      "Iju",
      "Ijm"
    ],
    "SHORTMONTH": [
      "M1",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M7",
      "M8",
      "M9",
      "M10",
      "M11",
      "M12"
    ],
    "STANDALONEMONTH": [
      "Mweri wa kwanza",
      "Mweri wa kaili",
      "Mweri wa katatu",
      "Mweri wa kaana",
      "Mweri wa tanu",
      "Mweri wa sita",
      "Mweri wa saba",
      "Mweri wa nane",
      "Mweri wa tisa",
      "Mweri wa ikumi",
      "Mweri wa ikumi na moja",
      "Mweri wa ikumi na mbili"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/y HH:mm",
    "shortDate": "dd/MM/y",
    "shortTime": "HH:mm"
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
        "maxFrac": 0,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "rof-tz",
  "localeID": "rof_TZ",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
