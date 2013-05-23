angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "a.m.",
      "1": "p.m."
    },
    "DAY": {
      "0": "domingo",
      "1": "lunes",
      "2": "martes",
      "3": "mi\u00e9rcoles",
      "4": "jueves",
      "5": "viernes",
      "6": "s\u00e1bado"
    },
    "MONTH": {
      "0": "enero",
      "1": "febrero",
      "2": "marzo",
      "3": "abril",
      "4": "mayo",
      "5": "junio",
      "6": "julio",
      "7": "agosto",
      "8": "septiembre",
      "9": "octubre",
      "10": "noviembre",
      "11": "diciembre"
    },
    "SHORTDAY": {
      "0": "dom",
      "1": "lun",
      "2": "mar",
      "3": "mi\u00e9",
      "4": "jue",
      "5": "vie",
      "6": "s\u00e1b"
    },
    "SHORTMONTH": {
      "0": "ene",
      "1": "feb",
      "2": "mar",
      "3": "abr",
      "4": "may",
      "5": "jun",
      "6": "jul",
      "7": "ago",
      "8": "sep",
      "9": "oct",
      "10": "nov",
      "11": "dic"
    },
    "fullDate": "EEEE, d 'de' MMMM 'de' y",
    "longDate": "d 'de' MMMM 'de' y",
    "medium": "dd/MM/yyyy HH:mm:ss",
    "mediumDate": "dd/MM/yyyy",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
    "PATTERNS": {
      "0": {
        "gSize": 3,
        "lgSize": 3,
        "macFrac": 0,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      "1": {
        "gSize": 3,
        "lgSize": 3,
        "macFrac": 0,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    }
  },
  "id": "es-ve",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);