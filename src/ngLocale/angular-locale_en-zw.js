angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "AM",
      "1": "PM"
    },
    "DAY": {
      "0": "Sunday",
      "1": "Monday",
      "2": "Tuesday",
      "3": "Wednesday",
      "4": "Thursday",
      "5": "Friday",
      "6": "Saturday"
    },
    "MONTH": {
      "0": "January",
      "1": "February",
      "2": "March",
      "3": "April",
      "4": "May",
      "5": "June",
      "6": "July",
      "7": "August",
      "8": "September",
      "9": "October",
      "10": "November",
      "11": "December"
    },
    "SHORTDAY": {
      "0": "Sun",
      "1": "Mon",
      "2": "Tue",
      "3": "Wed",
      "4": "Thu",
      "5": "Fri",
      "6": "Sat"
    },
    "SHORTMONTH": {
      "0": "Jan",
      "1": "Feb",
      "2": "Mar",
      "3": "Apr",
      "4": "May",
      "5": "Jun",
      "6": "Jul",
      "7": "Aug",
      "8": "Sep",
      "9": "Oct",
      "10": "Nov",
      "11": "Dec"
    },
    "fullDate": "EEEE dd MMMM y",
    "longDate": "dd MMMM y",
    "medium": "dd MMM,y h:mm:ss a",
    "mediumDate": "dd MMM,y",
    "mediumTime": "h:mm:ss a",
    "short": "d/M/yyyy h:mm a",
    "shortDate": "d/M/yyyy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "$",
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
  "id": "en-zw",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);