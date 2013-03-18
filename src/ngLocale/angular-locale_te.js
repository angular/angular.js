angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "am",
      "1": "pm"
    },
    "DAY": {
      "0": "ఆదివారం",
      "1": "సోమవారం",
      "2": "మంగళవారం",
      "3": "బుధవారం",
      "4": "గురువారం",
      "5": "శుక్రవారం",
      "6": "శనివారం"
    },
    "MONTH": {
      "0": "జనవరి",
      "1": "ఫిబ్రవరి",
      "2": "మార్చి",
      "3": "ఎప్రిల్",
      "4": "మే",
      "5": "జూన్",
      "6": "జూలై",
      "7": "ఆగస్టు",
      "8": "సెప్టెంబర్",
      "9": "అక్టోబర్",
      "10": "నవంబర్",
      "11": "డిసెంబర్"
    },
    "SHORTDAY": {
      "0": "ఆది",
      "1": "సోమ",
      "2": "మంగళ",
      "3": "బుధ",
      "4": "గురు",
      "5": "శుక్ర",
      "6": "శని"
    },
    "SHORTMONTH": {
      "0": "జన",
      "1": "ఫిబ్ర",
      "2": "మార్చి",
      "3": "ఏప్రి",
      "4": "మే",
      "5": "జూన్",
      "6": "జూలై",
      "7": "ఆగస్టు",
      "8": "సెప్టెంబర్",
      "9": "అక్టోబర్",
      "10": "నవంబర్",
      "11": "డిసెంబర్"
    },
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "dd-MM-yy h:mm a",
    "shortDate": "dd-MM-yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "₹",
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
        "negPre": "(\u00A4",
        "negSuf": ")",
        "posPre": "\u00A4",
        "posSuf": ""
      }
    }
  },
  "id": "te",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);