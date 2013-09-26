angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "AM",
      "PM"
    ],
    "DAY": [
      "Linggo",
      "Lunes",
      "Martes",
      "Miyerkules",
      "Huwebes",
      "Biyernes",
      "Sabado"
    ],
    "MONTH": [
      "Enero",
      "Pebrero",
      "Marso",
      "Abril",
      "Mayo",
      "Hunyo",
      "Hulyo",
      "Agosto",
      "Setyembre",
      "Oktubre",
      "Nobyembre",
      "Disyembre"
    ],
    "SHORTDAY": [
      "Lin",
      "Lun",
      "Mar",
      "Mye",
      "Huw",
      "Bye",
      "Sab"
    ],
    "SHORTMONTH": [
      "Ene",
      "Peb",
      "Mar",
      "Abr",
      "May",
      "Hun",
      "Hul",
      "Ago",
      "Set",
      "Okt",
      "Nob",
      "Dis"
    ],
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
    "PATTERNS": [
      {
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
      {
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
    ]
  },
  "id": "fil-ph",
  "pluralCat": function (n) {  if (n == 0 || n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);