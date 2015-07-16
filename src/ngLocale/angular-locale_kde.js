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
      "Muhi",
      "Chilo"
    ],
    "DAY": [
      "Liduva lyapili",
      "Liduva lyatatu",
      "Liduva lyanchechi",
      "Liduva lyannyano",
      "Liduva lyannyano na linji",
      "Liduva lyannyano na mavili",
      "Liduva litandi"
    ],
    "ERANAMES": [
      "Akanapawa Yesu",
      "Nankuida Yesu"
    ],
    "ERAS": [
      "AY",
      "NY"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Mwedi Ntandi",
      "Mwedi wa Pili",
      "Mwedi wa Tatu",
      "Mwedi wa Nchechi",
      "Mwedi wa Nnyano",
      "Mwedi wa Nnyano na Umo",
      "Mwedi wa Nnyano na Mivili",
      "Mwedi wa Nnyano na Mitatu",
      "Mwedi wa Nnyano na Nchechi",
      "Mwedi wa Nnyano na Nnyano",
      "Mwedi wa Nnyano na Nnyano na U",
      "Mwedi wa Nnyano na Nnyano na M"
    ],
    "SHORTDAY": [
      "Ll2",
      "Ll3",
      "Ll4",
      "Ll5",
      "Ll6",
      "Ll7",
      "Ll1"
    ],
    "SHORTMONTH": [
      "Jan",
      "Feb",
      "Mac",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Okt",
      "Nov",
      "Des"
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
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "kde",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
