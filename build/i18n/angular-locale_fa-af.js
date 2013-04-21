angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "قبل‌ازظهر",
      "1": "بعدازظهر"
    },
    "DAY": {
      "0": "یکشنبه",
      "1": "دوشنبه",
      "2": "سه‌شنبه",
      "3": "چهارشنبه",
      "4": "پنجشنبه",
      "5": "جمعه",
      "6": "شنبه"
    },
    "MONTH": {
      "0": "جنوری",
      "1": "فبروری",
      "2": "مارچ",
      "3": "اپریل",
      "4": "می",
      "5": "جون",
      "6": "جولای",
      "7": "اگست",
      "8": "سپتمبر",
      "9": "اکتوبر",
      "10": "نومبر",
      "11": "دسمبر"
    },
    "SHORTDAY": {
      "0": "یکشنبه",
      "1": "دوشنبه",
      "2": "سه‌شنبه",
      "3": "چهارشنبه",
      "4": "پنجشنبه",
      "5": "جمعه",
      "6": "شنبه"
    },
    "SHORTMONTH": {
      "0": "جنو",
      "1": "فوریهٔ",
      "2": "مارس",
      "3": "آوریل",
      "4": "مـی",
      "5": "ژوئن",
      "6": "جول",
      "7": "اوت",
      "8": "سپتامبر",
      "9": "اکتبر",
      "10": "نوامبر",
      "11": "دسم"
    },
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y H:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "H:mm:ss",
    "short": "yyyy/M/d H:mm",
    "shortDate": "yyyy/M/d",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Rial",
    "DECIMAL_SEP": "٫",
    "GROUP_SEP": "٬",
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
        "negPre": "‎(\u00A4",
        "negSuf": ")",
        "posPre": "‎\u00A4",
        "posSuf": ""
      }
    }
  },
  "id": "fa-af",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);