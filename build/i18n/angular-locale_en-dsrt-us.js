angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "𐐈𐐣",
      "1": "𐐑𐐣"
    },
    "DAY": {
      "0": "𐐝𐐲𐑌𐐼𐐩",
      "1": "𐐣𐐲𐑌𐐼𐐩",
      "2": "𐐓𐐭𐑆𐐼𐐩",
      "3": "𐐎𐐯𐑌𐑆𐐼𐐩",
      "4": "𐐛𐐲𐑉𐑆𐐼𐐩",
      "5": "𐐙𐑉𐐴𐐼𐐩",
      "6": "𐐝𐐰𐐻𐐲𐑉𐐼𐐩"
    },
    "MONTH": {
      "0": "𐐖𐐰𐑌𐐷𐐭𐐯𐑉𐐨",
      "1": "𐐙𐐯𐐺𐑉𐐭𐐯𐑉𐐨",
      "2": "𐐣𐐪𐑉𐐽",
      "3": "𐐁𐐹𐑉𐐮𐑊",
      "4": "𐐣𐐩",
      "5": "𐐖𐐭𐑌",
      "6": "𐐖𐐭𐑊𐐴",
      "7": "𐐂𐑀𐐲𐑅𐐻",
      "8": "𐐝𐐯𐐹𐐻𐐯𐑋𐐺𐐲𐑉",
      "9": "𐐉𐐿𐐻𐐬𐐺𐐲𐑉",
      "10": "𐐤𐐬𐑂𐐯𐑋𐐺𐐲𐑉",
      "11": "𐐔𐐨𐑅𐐯𐑋𐐺𐐲𐑉"
    },
    "SHORTDAY": {
      "0": "𐐝𐐲𐑌",
      "1": "𐐣𐐲𐑌",
      "2": "𐐓𐐭𐑆",
      "3": "𐐎𐐯𐑌",
      "4": "𐐛𐐲𐑉",
      "5": "𐐙𐑉𐐴",
      "6": "𐐝𐐰𐐻"
    },
    "SHORTMONTH": {
      "0": "𐐖𐐰𐑌",
      "1": "𐐙𐐯𐐺",
      "2": "𐐣𐐪𐑉",
      "3": "𐐁𐐹𐑉",
      "4": "𐐣𐐩",
      "5": "𐐖𐐭𐑌",
      "6": "𐐖𐐭𐑊",
      "7": "𐐂𐑀",
      "8": "𐐝𐐯𐐹",
      "9": "𐐉𐐿𐐻",
      "10": "𐐤𐐬𐑂",
      "11": "𐐔𐐨𐑅"
    },
    "fullDate": "EEEE, MMMM d, y",
    "longDate": "MMMM d, y",
    "medium": "MMM d, y h:mm:ss a",
    "mediumDate": "MMM d, y",
    "mediumTime": "h:mm:ss a",
    "short": "M/d/yy h:mm a",
    "shortDate": "M/d/yy",
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
        "negPre": "(\u00A4",
        "negSuf": ")",
        "posPre": "\u00A4",
        "posSuf": ""
      }
    }
  },
  "id": "en-dsrt-us",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);