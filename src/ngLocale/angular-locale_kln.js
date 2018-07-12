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
      "karoon",
      "kooskoliny"
    ],
    "DAY": [
      "Kotisap",
      "Kotaai",
      "Koaeng\u2019",
      "Kosomok",
      "Koang\u2019wan",
      "Komuut",
      "Kolo"
    ],
    "ERANAMES": [
      "Amait kesich Jesu",
      "Kokakesich Jesu"
    ],
    "ERAS": [
      "AM",
      "KO"
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "Mulgul",
      "Ng\u2019atyaato",
      "Kiptaamo",
      "Iwootkuut",
      "Mamuut",
      "Paagi",
      "Ng\u2019eiyeet",
      "Rooptui",
      "Bureet",
      "Epeeso",
      "Kipsuunde ne taai",
      "Kipsuunde nebo aeng\u2019"
    ],
    "SHORTDAY": [
      "Kts",
      "Kot",
      "Koo",
      "Kos",
      "Koa",
      "Kom",
      "Kol"
    ],
    "SHORTMONTH": [
      "Mul",
      "Ngat",
      "Taa",
      "Iwo",
      "Mam",
      "Paa",
      "Nge",
      "Roo",
      "Bur",
      "Epe",
      "Kpt",
      "Kpa"
    ],
    "STANDALONEMONTH": [
      "Mulgul",
      "Ng\u2019atyaato",
      "Kiptaamo",
      "Iwootkuut",
      "Mamuut",
      "Paagi",
      "Ng\u2019eiyeet",
      "Rooptui",
      "Bureet",
      "Epeeso",
      "Kipsuunde ne taai",
      "Kipsuunde nebo aeng\u2019"
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
    "CURRENCY_SYM": "Ksh",
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
  "id": "kln",
  "localeID": "kln",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
