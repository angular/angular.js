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
      "Subbaahi",
      "Zaarikay b"
    ],
    "DAY": [
      "Alhadi",
      "Atinni",
      "Atalaata",
      "Alarba",
      "Alhamiisa",
      "Alzuma",
      "Asibti"
    ],
    "MONTH": [
      "\u017danwiye",
      "Feewiriye",
      "Marsi",
      "Awiril",
      "Me",
      "\u017duwe\u014b",
      "\u017duyye",
      "Ut",
      "Sektanbur",
      "Oktoobur",
      "Noowanbur",
      "Deesanbur"
    ],
    "SHORTDAY": [
      "Alh",
      "Ati",
      "Ata",
      "Ala",
      "Alm",
      "Alz",
      "Asi"
    ],
    "SHORTMONTH": [
      "\u017dan",
      "Fee",
      "Mar",
      "Awi",
      "Me",
      "\u017duw",
      "\u017duy",
      "Ut",
      "Sek",
      "Okt",
      "Noo",
      "Dee"
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/y HH:mm",
    "shortDate": "d/M/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "CFA",
    "DECIMAL_SEP": ".",
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
        "negSuf": "\u00a4",
        "posPre": "",
        "posSuf": "\u00a4"
      }
    ]
  },
  "id": "twq",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
