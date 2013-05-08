angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "AM",
      "1": "PM"
    },
    "DAY": {
      "0": "domingo",
      "1": "segunda-feira",
      "2": "ter\u00e7a-feira",
      "3": "quarta-feira",
      "4": "quinta-feira",
      "5": "sexta-feira",
      "6": "s\u00e1bado"
    },
    "MONTH": {
      "0": "janeiro",
      "1": "fevereiro",
      "2": "mar\u00e7o",
      "3": "abril",
      "4": "maio",
      "5": "junho",
      "6": "julho",
      "7": "agosto",
      "8": "setembro",
      "9": "outubro",
      "10": "novembro",
      "11": "dezembro"
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
      "0": "jan",
      "1": "fev",
      "2": "mar",
      "3": "abr",
      "4": "mai",
      "5": "jun",
      "6": "jul",
      "7": "ago",
      "8": "set",
      "9": "out",
      "10": "nov",
      "11": "dez"
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
    "CURRENCY_SYM": "R$",
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
        "negPre": "(\u00a4",
        "negSuf": ")",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    }
  },
  "id": "pt",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);