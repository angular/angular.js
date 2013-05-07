angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "PG",
      "1": "PTG"
    },
    "DAY": {
      "0": "Ahad",
      "1": "Isnin",
      "2": "Selasa",
      "3": "Rabu",
      "4": "Khamis",
      "5": "Jumaat",
      "6": "Sabtu"
    },
    "MONTH": {
      "0": "Januari",
      "1": "Februari",
      "2": "Mac",
      "3": "April",
      "4": "Mei",
      "5": "Jun",
      "6": "Julai",
      "7": "Ogos",
      "8": "September",
      "9": "Oktober",
      "10": "November",
      "11": "Disember"
    },
    "SHORTDAY": {
      "0": "Ahd",
      "1": "Isn",
      "2": "Sel",
      "3": "Rab",
      "4": "Kha",
      "5": "Jum",
      "6": "Sab"
    },
    "SHORTMONTH": {
      "0": "Jan",
      "1": "Feb",
      "2": "Mac",
      "3": "Apr",
      "4": "Mei",
      "5": "Jun",
      "6": "Jul",
      "7": "Ogos",
      "8": "Sep",
      "9": "Okt",
      "10": "Nov",
      "11": "Dis"
    },
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "dd/MM/yyyy h:mm:ss a",
    "mediumDate": "dd/MM/yyyy",
    "mediumTime": "h:mm:ss a",
    "short": "d/MM/yy h:mm a",
    "shortDate": "d/MM/yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "RM",
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
  "id": "ms-my",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);