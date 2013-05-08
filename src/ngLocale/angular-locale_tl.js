angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "AM",
      "1": "PM"
    },
    "DAY": {
      "0": "Linggo",
      "1": "Lunes",
      "2": "Martes",
      "3": "Miyerkules",
      "4": "Huwebes",
      "5": "Biyernes",
      "6": "Sabado"
    },
    "MONTH": {
      "0": "Enero",
      "1": "Pebrero",
      "2": "Marso",
      "3": "Abril",
      "4": "Mayo",
      "5": "Hunyo",
      "6": "Hulyo",
      "7": "Agosto",
      "8": "Setyembre",
      "9": "Oktubre",
      "10": "Nobyembre",
      "11": "Disyembre"
    },
    "SHORTDAY": {
      "0": "Lin",
      "1": "Lun",
      "2": "Mar",
      "3": "Mye",
      "4": "Huw",
      "5": "Bye",
      "6": "Sab"
    },
    "SHORTMONTH": {
      "0": "Ene",
      "1": "Peb",
      "2": "Mar",
      "3": "Abr",
      "4": "May",
      "5": "Hun",
      "6": "Hul",
      "7": "Ago",
      "8": "Set",
      "9": "Okt",
      "10": "Nob",
      "11": "Dis"
    },
    "fullDate": "EEEE, MMMM dd y",
    "longDate": "MMMM d, y",
    "medium": "MMM d, y HH:mm:ss",
    "mediumDate": "MMM d, y",
    "mediumTime": "HH:mm:ss",
    "short": "M/d/yy HH:mm",
    "shortDate": "M/d/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20b1",
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
  "id": "tl",
  "pluralCat": function (n) {  if (n == 0 || n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);