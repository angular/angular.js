angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "AM",
      "1": "PM"
    },
    "DAY": {
      "0": "Sonto",
      "1": "Msombuluko",
      "2": "Lwesibili",
      "3": "Lwesithathu",
      "4": "uLwesine",
      "5": "Lwesihlanu",
      "6": "Mgqibelo"
    },
    "MONTH": {
      "0": "Januwari",
      "1": "Februwari",
      "2": "Mashi",
      "3": "Apreli",
      "4": "Meyi",
      "5": "Juni",
      "6": "Julayi",
      "7": "Agasti",
      "8": "Septhemba",
      "9": "Okthoba",
      "10": "Novemba",
      "11": "Disemba"
    },
    "SHORTDAY": {
      "0": "Son",
      "1": "Mso",
      "2": "Bil",
      "3": "Tha",
      "4": "Sin",
      "5": "Hla",
      "6": "Mgq"
    },
    "SHORTMONTH": {
      "0": "Jan",
      "1": "Feb",
      "2": "Mas",
      "3": "Apr",
      "4": "Mey",
      "5": "Jun",
      "6": "Jul",
      "7": "Aga",
      "8": "Sep",
      "9": "Okt",
      "10": "Nov",
      "11": "Dis"
    },
    "fullDate": "EEEE dd MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "yyyy-MM-dd h:mm a",
    "shortDate": "yyyy-MM-dd",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "R",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
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
  "id": "zu-za",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);