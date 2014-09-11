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
      "Swondaha",
      "Musumbuluwo",
      "\u1e3cavhuvhili",
      "\u1e3cavhuraru",
      "\u1e3cavhu\u1e4ba",
      "\u1e3cavhu\u1e71anu",
      "Mugivhela"
    ],
    "MONTH": [
      "Phando",
      "Luhuhi",
      "\u1e70hafamuhwe",
      "Lambamai",
      "Shundunthule",
      "Fulwi",
      "Fulwana",
      "\u1e70hangule",
      "Khubvumedzi",
      "Tshimedzi",
      "\u1e3cara",
      "Nyendavhusiku"
    ],
    "SHORTDAY": [
      "Swo",
      "Mus",
      "Vhi",
      "Rar",
      "\u1e4aa",
      "\u1e70an",
      "Mug"
    ],
    "SHORTMONTH": [
      "Pha",
      "Luh",
      "\u1e70hf",
      "Lam",
      "Shu",
      "Lwi",
      "Lwa",
      "\u1e70ha",
      "Khu",
      "Tsh",
      "\u1e3car",
      "Nye"
    ],
    "fullDate": "y MMMM d, EEEE",
    "longDate": "y MMMM d",
    "medium": "y MMM d HH:mm:ss",
    "mediumDate": "y MMM d",
    "mediumTime": "HH:mm:ss",
    "short": "y-MM-dd HH:mm",
    "shortDate": "y-MM-dd",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "R",
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "ve-za",
  "pluralCat": function (n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);