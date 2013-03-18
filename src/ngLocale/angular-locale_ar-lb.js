angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "ص",
      "1": "م"
    },
    "DAY": {
      "0": "الأحد",
      "1": "الاثنين",
      "2": "الثلاثاء",
      "3": "الأربعاء",
      "4": "الخميس",
      "5": "الجمعة",
      "6": "السبت"
    },
    "MONTH": {
      "0": "كانون الثاني",
      "1": "شباط",
      "2": "آذار",
      "3": "نيسان",
      "4": "أيار",
      "5": "حزيران",
      "6": "تموز",
      "7": "آب",
      "8": "أيلول",
      "9": "تشرين الأول",
      "10": "تشرين الثاني",
      "11": "كانون الأول"
    },
    "SHORTDAY": {
      "0": "الأحد",
      "1": "الاثنين",
      "2": "الثلاثاء",
      "3": "الأربعاء",
      "4": "الخميس",
      "5": "الجمعة",
      "6": "السبت"
    },
    "SHORTMONTH": {
      "0": "كانون الثاني",
      "1": "شباط",
      "2": "آذار",
      "3": "نيسان",
      "4": "أيار",
      "5": "حزيران",
      "6": "تموز",
      "7": "آب",
      "8": "أيلول",
      "9": "تشرين الأول",
      "10": "تشرين الثاني",
      "11": "كانون الأول"
    },
    "fullDate": "EEEE، d MMMM، y",
    "longDate": "d MMMM، y",
    "medium": "dd‏/MM‏/yyyy h:mm:ss a",
    "mediumDate": "dd‏/MM‏/yyyy",
    "mediumTime": "h:mm:ss a",
    "short": "d‏/M‏/yyyy h:mm a",
    "shortDate": "d‏/M‏/yyyy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "£",
    "DECIMAL_SEP": "٫",
    "GROUP_SEP": "٬",
    "PATTERNS": {
      "0": {
        "gSize": 0,
        "lgSize": 0,
        "macFrac": 0,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "",
        "negSuf": "-",
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
        "negPre": "\u00A4 ",
        "negSuf": "-",
        "posPre": "\u00A4 ",
        "posSuf": ""
      }
    }
  },
  "id": "ar-lb",
  "pluralCat": function (n) {  if (n == 0) {   return PLURAL_CATEGORY.ZERO;  }  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  if (n == 2) {   return PLURAL_CATEGORY.TWO;  }  if (n == (n | 0) && n % 100 >= 3 && n % 100 <= 10) {   return PLURAL_CATEGORY.FEW;  }  if (n == (n | 0) && n % 100 >= 11 && n % 100 <= 99) {   return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);