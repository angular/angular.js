'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "AM",
      "PM"
    ],
    "DAY": [
      "ISonto",
      "UMsombuluko",
      "ULwesibili",
      "ULwesithathu",
      "ULwesine",
      "ULwesihlanu",
      "UMgqibelo"
    ],
    "ERANAMES": [
      "BC",
      "AD"
    ],
    "ERAS": [
      "BC",
      "AD"
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "UMasingana",
      "Februwari",
      "Mashi",
      "Ephreli",
      "Meyi",
      "Juni",
      "Julayi",
      "Agasti",
      "Septhemba",
      "Okthoba",
      "Novemba",
      "Disemba"
    ],
    "SHORTDAY": [
      "Son",
      "Mso",
      "Bil",
      "Tha",
      "Sin",
      "Hla",
      "Mgq"
    ],
    "SHORTMONTH": [
      "Jan",
      "Feb",
      "Mas",
      "Eph",
      "Mey",
      "Jun",
      "Jul",
      "Aga",
      "Sep",
      "Okt",
      "Nov",
      "Dis"
    ],
    "STANDALONEMONTH": [
      "Januwari",
      "Februwari",
      "Mashi",
      "Ephreli",
      "Meyi",
      "Juni",
      "Julayi",
      "Agasti",
      "Septhemba",
      "Okthoba",
      "Novemba",
      "Disemba"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, MMMM d, y",
    "longDate": "MMMM d, y",
    "medium": "MMM d, y HH:mm:ss",
    "mediumDate": "MMM d, y",
    "mediumTime": "HH:mm:ss",
    "short": "M/d/yy HH:mm",
    "shortDate": "M/d/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "R",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
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
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "zu",
  "localeID": "zu",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  if (i == 0 || n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
