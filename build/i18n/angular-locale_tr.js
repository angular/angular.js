angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "AM",
      "1": "PM"
    },
    "DAY": {
      "0": "Pazar",
      "1": "Pazartesi",
      "2": "Salı",
      "3": "Çarşamba",
      "4": "Perşembe",
      "5": "Cuma",
      "6": "Cumartesi"
    },
    "MONTH": {
      "0": "Ocak",
      "1": "Şubat",
      "2": "Mart",
      "3": "Nisan",
      "4": "Mayıs",
      "5": "Haziran",
      "6": "Temmuz",
      "7": "Ağustos",
      "8": "Eylül",
      "9": "Ekim",
      "10": "Kasım",
      "11": "Aralık"
    },
    "SHORTDAY": {
      "0": "Paz",
      "1": "Pzt",
      "2": "Sal",
      "3": "Çar",
      "4": "Per",
      "5": "Cum",
      "6": "Cmt"
    },
    "SHORTMONTH": {
      "0": "Oca",
      "1": "Şub",
      "2": "Mar",
      "3": "Nis",
      "4": "May",
      "5": "Haz",
      "6": "Tem",
      "7": "Ağu",
      "8": "Eyl",
      "9": "Eki",
      "10": "Kas",
      "11": "Ara"
    },
    "fullDate": "d MMMM y EEEE",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd MM yyyy HH:mm",
    "shortDate": "dd MM yyyy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "TL",
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
        "negPre": "(",
        "negSuf": " \u00A4)",
        "posPre": "",
        "posSuf": " \u00A4"
      }
    }
  },
  "id": "tr",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);