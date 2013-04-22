angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "a.m.",
      "1": "p.m."
    },
    "DAY": {
      "0": "Domingo",
      "1": "Segunda-feira",
      "2": "Ter\u00e7a-feira",
      "3": "Quarta-feira",
      "4": "Quinta-feira",
      "5": "Sexta-feira",
      "6": "S\u00e1bado"
    },
    "MONTH": {
      "0": "Janeiro",
      "1": "Fevereiro",
      "2": "Mar\u00e7o",
      "3": "Abril",
      "4": "Maio",
      "5": "Junho",
      "6": "Julho",
      "7": "Agosto",
      "8": "Setembro",
      "9": "Outubro",
      "10": "Novembro",
      "11": "Dezembro"
    },
    "SHORTDAY": {
      "0": "dom",
      "1": "seg",
      "2": "ter",
      "3": "qua",
      "4": "qui",
      "5": "sex",
      "6": "s\u00e1b"
    },
    "SHORTMONTH": {
      "0": "Jan",
      "1": "Fev",
      "2": "Mar",
      "3": "Abr",
      "4": "Mai",
      "5": "Jun",
      "6": "Jul",
      "7": "Ago",
      "8": "Set",
      "9": "Out",
      "10": "Nov",
      "11": "Dez"
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
    "GROUP_SEP": "\u00a0",
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
  "id": "pt-pt",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);