angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "enne keskp\u00e4eva",
      "1": "p\u00e4rast keskp\u00e4eva"
    },
    "DAY": {
      "0": "p\u00fchap\u00e4ev",
      "1": "esmasp\u00e4ev",
      "2": "teisip\u00e4ev",
      "3": "kolmap\u00e4ev",
      "4": "neljap\u00e4ev",
      "5": "reede",
      "6": "laup\u00e4ev"
    },
    "MONTH": {
      "0": "jaanuar",
      "1": "veebruar",
      "2": "m\u00e4rts",
      "3": "aprill",
      "4": "mai",
      "5": "juuni",
      "6": "juuli",
      "7": "august",
      "8": "september",
      "9": "oktoober",
      "10": "november",
      "11": "detsember"
    },
    "SHORTDAY": {
      "0": "P",
      "1": "E",
      "2": "T",
      "3": "K",
      "4": "N",
      "5": "R",
      "6": "L"
    },
    "SHORTMONTH": {
      "0": "jaan",
      "1": "veebr",
      "2": "m\u00e4rts",
      "3": "apr",
      "4": "mai",
      "5": "juuni",
      "6": "juuli",
      "7": "aug",
      "8": "sept",
      "9": "okt",
      "10": "nov",
      "11": "dets"
    },
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "dd.MM.yyyy H:mm.ss",
    "mediumDate": "dd.MM.yyyy",
    "mediumTime": "H:mm.ss",
    "short": "dd.MM.yy H:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "H:mm"
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
        "gSize": 0,
        "lgSize": 0,
        "macFrac": 0,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "(",
        "negSuf": "\u00a4)",
        "posPre": "",
        "posSuf": "\u00a4"
      }
    }
  },
  "id": "et-ee",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);