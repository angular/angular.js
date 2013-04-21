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
      "1": "Luns",
      "2": "Martes",
      "3": "Mércores",
      "4": "Xoves",
      "5": "Venres",
      "6": "Sábado"
    },
    "MONTH": {
      "0": "Xaneiro",
      "1": "Febreiro",
      "2": "Marzo",
      "3": "Abril",
      "4": "Maio",
      "5": "Xuño",
      "6": "Xullo",
      "7": "Agosto",
      "8": "Setembro",
      "9": "Outubro",
      "10": "Novembro",
      "11": "Decembro"
    },
    "SHORTDAY": {
      "0": "Dom",
      "1": "Lun",
      "2": "Mar",
      "3": "Mér",
      "4": "Xov",
      "5": "Ven",
      "6": "Sáb"
    },
    "SHORTMONTH": {
      "0": "Xan",
      "1": "Feb",
      "2": "Mar",
      "3": "Abr",
      "4": "Mai",
      "5": "Xuñ",
      "6": "Xul",
      "7": "Ago",
      "8": "Set",
      "9": "Out",
      "10": "Nov",
      "11": "Dec"
    },
    "fullDate": "EEEE dd MMMM y",
    "longDate": "dd MMMM y",
    "medium": "d MMM, y HH:mm:ss",
    "mediumDate": "d MMM, y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "€",
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
        "negPre": "(\u00A4",
        "negSuf": ")",
        "posPre": "\u00A4",
        "posSuf": ""
      }
    }
  },
  "id": "gl-es",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);