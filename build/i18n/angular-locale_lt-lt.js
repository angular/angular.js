angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "priešpiet",
      "1": "popiet"
    },
    "DAY": {
      "0": "sekmadienis",
      "1": "pirmadienis",
      "2": "antradienis",
      "3": "trečiadienis",
      "4": "ketvirtadienis",
      "5": "penktadienis",
      "6": "šeštadienis"
    },
    "MONTH": {
      "0": "sausio",
      "1": "vasaris",
      "2": "kovas",
      "3": "balandis",
      "4": "gegužė",
      "5": "birželis",
      "6": "liepa",
      "7": "rugpjūtis",
      "8": "rugsėjis",
      "9": "spalis",
      "10": "lapkritis",
      "11": "gruodis"
    },
    "SHORTDAY": {
      "0": "Sk",
      "1": "Pr",
      "2": "An",
      "3": "Tr",
      "4": "Kt",
      "5": "Pn",
      "6": "Št"
    },
    "SHORTMONTH": {
      "0": "Saus.",
      "1": "Vas",
      "2": "Kov.",
      "3": "Bal.",
      "4": "Geg.",
      "5": "Bir.",
      "6": "Liep.",
      "7": "Rugp.",
      "8": "Rugs.",
      "9": "Spal.",
      "10": "Lapkr.",
      "11": "Gruod."
    },
    "fullDate": "y 'm'. MMMM d 'd'., EEEE",
    "longDate": "y 'm'. MMMM d 'd'.",
    "medium": "y MMM d HH:mm:ss",
    "mediumDate": "y MMM d",
    "mediumTime": "HH:mm:ss",
    "short": "yyyy-MM-dd HH:mm",
    "shortDate": "yyyy-MM-dd",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Lt",
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
        "negPre": "-",
        "negSuf": " \u00A4",
        "posPre": "",
        "posSuf": " \u00A4"
      }
    }
  },
  "id": "lt-lt",
  "pluralCat": function (n) {  if (n % 10 == 1 && (n % 100 < 11 || n % 100 > 19)) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 11 || n % 100 > 19)) {   return PLURAL_CATEGORY.FEW;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);