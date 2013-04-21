angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "לפנה״צ",
      "1": "אחה״צ"
    },
    "DAY": {
      "0": "יום ראשון",
      "1": "יום שני",
      "2": "יום שלישי",
      "3": "יום רביעי",
      "4": "יום חמישי",
      "5": "יום שישי",
      "6": "יום שבת"
    },
    "MONTH": {
      "0": "ינואר",
      "1": "פברואר",
      "2": "מרץ",
      "3": "אפריל",
      "4": "מאי",
      "5": "יוני",
      "6": "יולי",
      "7": "אוגוסט",
      "8": "ספטמבר",
      "9": "אוקטובר",
      "10": "נובמבר",
      "11": "דצמבר"
    },
    "SHORTDAY": {
      "0": "יום א׳",
      "1": "יום ב׳",
      "2": "יום ג׳",
      "3": "יום ד׳",
      "4": "יום ה׳",
      "5": "יום ו׳",
      "6": "שבת"
    },
    "SHORTMONTH": {
      "0": "ינו",
      "1": "פבר",
      "2": "מרץ",
      "3": "אפר",
      "4": "מאי",
      "5": "יונ",
      "6": "יול",
      "7": "אוג",
      "8": "ספט",
      "9": "אוק",
      "10": "נוב",
      "11": "דצמ"
    },
    "fullDate": "EEEE, d בMMMM y",
    "longDate": "d בMMMM y",
    "medium": "d בMMM yyyy HH:mm:ss",
    "mediumDate": "d בMMM yyyy",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "₪",
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
        "negPre": "-",
        "negSuf": " \u00A4",
        "posPre": "",
        "posSuf": " \u00A4"
      }
    }
  },
  "id": "he-il",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);