angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "PD",
      "1": "MD"
    },
    "DAY": {
      "0": "e diel",
      "1": "e hënë",
      "2": "e martë",
      "3": "e mërkurë",
      "4": "e enjte",
      "5": "e premte",
      "6": "e shtunë"
    },
    "MONTH": {
      "0": "janar",
      "1": "shkurt",
      "2": "mars",
      "3": "prill",
      "4": "maj",
      "5": "qershor",
      "6": "korrik",
      "7": "gusht",
      "8": "shtator",
      "9": "tetor",
      "10": "nëntor",
      "11": "dhjetor"
    },
    "SHORTDAY": {
      "0": "Die",
      "1": "Hën",
      "2": "Mar",
      "3": "Mër",
      "4": "Enj",
      "5": "Pre",
      "6": "Sht"
    },
    "SHORTMONTH": {
      "0": "Jan",
      "1": "Shk",
      "2": "Mar",
      "3": "Pri",
      "4": "Maj",
      "5": "Qer",
      "6": "Kor",
      "7": "Gsh",
      "8": "Sht",
      "9": "Tet",
      "10": "Nën",
      "11": "Dhj"
    },
    "fullDate": "EEEE, dd MMMM y",
    "longDate": "dd MMMM y",
    "medium": "yyyy-MM-dd h.mm.ss.a",
    "mediumDate": "yyyy-MM-dd",
    "mediumTime": "h.mm.ss.a",
    "short": "yy-MM-dd h.mm.a",
    "shortDate": "yy-MM-dd",
    "shortTime": "h.mm.a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Lek",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": " ",
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
        "negPre": "\u00A4-",
        "negSuf": "",
        "posPre": "\u00A4",
        "posSuf": ""
      }
    }
  },
  "id": "sq",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);