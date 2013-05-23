angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "priek\u0161pusdien\u0101",
      "1": "p\u0113cpusdien\u0101"
    },
    "DAY": {
      "0": "sv\u0113tdiena",
      "1": "pirmdiena",
      "2": "otrdiena",
      "3": "tre\u0161diena",
      "4": "ceturtdiena",
      "5": "piektdiena",
      "6": "sestdiena"
    },
    "MONTH": {
      "0": "janv\u0101ris",
      "1": "febru\u0101ris",
      "2": "marts",
      "3": "apr\u012blis",
      "4": "maijs",
      "5": "j\u016bnijs",
      "6": "j\u016blijs",
      "7": "augusts",
      "8": "septembris",
      "9": "oktobris",
      "10": "novembris",
      "11": "decembris"
    },
    "SHORTDAY": {
      "0": "Sv",
      "1": "Pr",
      "2": "Ot",
      "3": "Tr",
      "4": "Ce",
      "5": "Pk",
      "6": "Se"
    },
    "SHORTMONTH": {
      "0": "janv.",
      "1": "febr.",
      "2": "marts",
      "3": "apr.",
      "4": "maijs",
      "5": "j\u016bn.",
      "6": "j\u016bl.",
      "7": "aug.",
      "8": "sept.",
      "9": "okt.",
      "10": "nov.",
      "11": "dec."
    },
    "fullDate": "EEEE, y. 'gada' d. MMMM",
    "longDate": "y. 'gada' d. MMMM",
    "medium": "y. 'gada' d. MMM HH:mm:ss",
    "mediumDate": "y. 'gada' d. MMM",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Ls",
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
        "negPre": "(\u00a4",
        "negSuf": ")",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    }
  },
  "id": "lv",
  "pluralCat": function (n) {  if (n == 0) {   return PLURAL_CATEGORY.ZERO;  }  if (n % 10 == 1 && n % 100 != 11) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);