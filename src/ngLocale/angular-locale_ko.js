angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "오전",
      "1": "오후"
    },
    "DAY": {
      "0": "일요일",
      "1": "월요일",
      "2": "화요일",
      "3": "수요일",
      "4": "목요일",
      "5": "금요일",
      "6": "토요일"
    },
    "MONTH": {
      "0": "1월",
      "1": "2월",
      "2": "3월",
      "3": "4월",
      "4": "5월",
      "5": "6월",
      "6": "7월",
      "7": "8월",
      "8": "9월",
      "9": "10월",
      "10": "11월",
      "11": "12월"
    },
    "SHORTDAY": {
      "0": "일",
      "1": "월",
      "2": "화",
      "3": "수",
      "4": "목",
      "5": "금",
      "6": "토"
    },
    "SHORTMONTH": {
      "0": "1월",
      "1": "2월",
      "2": "3월",
      "3": "4월",
      "4": "5월",
      "5": "6월",
      "6": "7월",
      "7": "8월",
      "8": "9월",
      "9": "10월",
      "10": "11월",
      "11": "12월"
    },
    "fullDate": "y년 M월 d일 EEEE",
    "longDate": "y년 M월 d일",
    "medium": "yyyy. M. d. a h:mm:ss",
    "mediumDate": "yyyy. M. d.",
    "mediumTime": "a h:mm:ss",
    "short": "yy. M. d. a h:mm",
    "shortDate": "yy. M. d.",
    "shortTime": "a h:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "₩",
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
  "id": "ko",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);