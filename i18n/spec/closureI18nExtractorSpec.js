var closureI18nExtractor = require('../src/closureI18nExtractor.js');
var converter = require('../src/converter.js');
findLocaleId = closureI18nExtractor.findLocaleId;
extractNumberSymbols = closureI18nExtractor.extractNumberSymbols;
extractCurrencySymbols = closureI18nExtractor.extractCurrencySymbols;
extractDateTimeSymbols = closureI18nExtractor.extractDateTimeSymbols;


function newTestLocaleInfo() {
  return { fr_CA: {
    DATETIME_FORMATS: {
      MONTH: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre',
        'octobre', 'novembre', 'décembre'],
      SHORTMONTH: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.',
        'nov.', 'déc.'],
      DAY: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
      SHORTDAY: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
      AMPMS: ['AM', 'PM'],
      medium: 'yyyy-MM-dd HH:mm:ss',
      short: 'yy-MM-dd HH:mm',
      fullDate: 'EEEE d MMMM y',
      longDate: 'd MMMM y',
      mediumDate: 'yyyy-MM-dd',
      shortDate: 'yy-MM-dd',
      mediumTime: 'HH:mm:ss',
      shortTime: 'HH:mm'
    },
    NUMBER_FORMATS: {
      "DECIMAL_SEP": ".",
      "GROUP_SEP": ",",
      "PATTERNS": [{
        "minInt": 1,
        "minFrac": 0,
        "macFrac": 0,
        "posPre": "",
        "posSuf": "",
        "negPre": "-",
        "negSuf": "",
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3
      }, {
        "minInt": 1,
        "minFrac": 2,
        "macFrac": 0,
        "posPre": "¤",
        "posSuf": "",
        "negPre": "¤-",
        "negSuf": "",
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2
      }],
      "CURRENCY_SYM": "£"
    }}};
}


describe("findLocaleId", function() {
  it("should find the id from numbers", function() {
    expect(findLocaleId("NumberFormatSymbols_en_GB", "num")).toEqual("en_GB");
  });


  it("should find the id from datetime", function() {
    expect(findLocaleId("DateTimeSymbols_en_ISO", "datetime")).toEqual("en_ISO");
  });


  it("should throw an error otherwise", function() {
    expect(function() {
      findLocaleId("str", "otherwise")
    }).toThrow("unknown type in findLocaleId: otherwise");
  });
});

describe("extractNumberSymbols", function() {
  it("should extract number data", function() {
    var CONTENT = [
      "goog.provide('goog.i18n.NumberFormatSymbols_en_GB');",
      "goog.i18n.NumberFormatSymbols_en_GB = {",
      "DECIMAL_SEP: '.',",
      "GROUP_SEP: ',',",
      "PERCENT: '%',",
      "ZERO_DIGIT: '0',",
      "PLUS_SIGN: '+',",
      "MINUS_SIGN: '-',",
      "EXP_SYMBOL: 'E',",
      "PERMILL: '\u2030',",
      "INFINITY: '\u221E',",
      "NAN: 'NaN',",
      "DECIMAL_PATTERN: '#,##0.###',",
      "SCIENTIFIC_PATTERN: '#E0',",
      "PERCENT_PATTERN: '#,##0%',",
      "CURRENCY_PATTERN: '\u00A4#,##0.00',",
      "DEF_CURRENCY_CODE: 'GBP' };"
    ].join('\n');

    var currencySymbols = {'GBP':[2, '£', 'GB£']};

    var expectedNumberFormats = converter.convertNumberData(
        {
          DECIMAL_SEP:'.',
          GROUP_SEP:',',
          DECIMAL_PATTERN:'#,##0.###',
          CURRENCY_PATTERN:'\u00A4#,##0.00',
          DEF_CURRENCY_CODE: 'GBP'
        }, currencySymbols
    );

    var localeInfo = {};
    extractNumberSymbols(CONTENT, localeInfo, currencySymbols);

    expect(localeInfo).toEqual({
      'en_GB': { NUMBER_FORMATS: expectedNumberFormats }
    });
  })
});

describe("extractCurrencySymbols", function() {
  it("should extract currency data", function() {
    var CONTENT = [
      "goog.i18n.currency.CurrencyInfo = {",
      "  'GBP':[2, '£', 'GB£'],",
      "};",
      "goog.i18n.currency.CurrencyInfoTier2 = {",
      "  'AOA':[2, 'Kz', 'Kz'],",
      "};"
    ].join('\n');

    var localeInfo = {};
    expect(extractCurrencySymbols(CONTENT)).toEqual({
      'GBP':[2, '£', 'GB£'],
      'AOA':[2, 'Kz', 'Kz']
    });
  });
});


describe("extractDateTimeSymbols", function() {
  it("should extract date time data", function() {
    var CONTENT = [
"goog.i18n.DateTimeSymbols_fr_CA = {",
"  ERAS: ['av. J.-C.', 'ap. J.-C.'],",
"  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],",
"  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],",
"  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O',",
"      'N', 'D'],",
"  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',",
"      'août', 'septembre', 'octobre', 'novembre', 'décembre'],",
"  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',",
"      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],",
"  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.',",
"      'août', 'sept.', 'oct.', 'nov.', 'déc.'],",
"  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',",
"      'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],",
"  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi',",
"      'samedi'],",
"  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi',",
"      'vendredi', 'samedi'],",
"  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],",
"  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.',",
"      'sam.'],",
"  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],",
"  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],",
"  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],",
"  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],",
"  AMPMS: ['AM', 'PM'],",
"  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'yyyy-MM-dd', 'yy-MM-dd'],",
"  TIMEFORMATS: ['HH \\'h\\' mm \\'min\\' ss \\'s\\' zzzz', 'HH:mm:ss z',",
"      'HH:mm:ss', 'HH:mm'],",
"  FIRSTDAYOFWEEK: 6,",
"  WEEKENDRANGE: [5, 6],",
"  FIRSTWEEKCUTOFFDAY: 2",
"};"
    ].join('\n');
      var localeInfo = {};
      var expectedLocaleInfo = {
          fr_CA: {
              DATETIME_FORMATS: {
                  MONTH: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre',
                      'octobre', 'novembre', 'décembre'],
                  SHORTMONTH: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.',
                      'nov.', 'déc.'],
                  DAY: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
                  SHORTDAY: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
                  FIRSTDAYOFWEEK: 6,
                  WEEKENDRANGE: [5, 6],
                  AMPMS: ['AM', 'PM'],
                  ERAS: ['av. J.-C.', 'ap. J.-C.'],
                  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
                  medium: 'yyyy-MM-dd HH:mm:ss',
                  short: 'yy-MM-dd HH:mm',
                  fullDate: 'EEEE d MMMM y',
                  longDate: 'd MMMM y',
                  mediumDate: 'yyyy-MM-dd',
                  shortDate: 'yy-MM-dd',
                  mediumTime: 'HH:mm:ss',
                  shortTime: 'HH:mm'
              }
            }
          };
      extractDateTimeSymbols(CONTENT, localeInfo);
      expect(localeInfo).toEqual(expectedLocaleInfo);
      })
});

describe("pluralExtractor", function() {
  it("should output PLURAL_CAT in the output string code", function() {
    var localeIds = ["fr_CA"];
    var content = (
        "goog.provide('goog.i18n.pluralRules');\n" +
        "\n" +
        "goog.i18n.pluralRules.Keyword = {\n" +
        "  ZERO: 'zero',\n" +
        "  ONE: 'one',\n" +
        "  TWO: 'two',\n" +
        "  FEW: 'few',\n" +
        "  MANY: 'many',\n" +
        "  OTHER: 'other'\n" +
        "};\n" +
        "\n" +
        "goog.i18n.pluralRules.frSelect_ = function(n) {\n" +
        "  if (n >= 0 && n < 2) {\n" +
        "    return goog.i18n.pluralRules.Keyword.ONE;\n" +
        "  }\n" +
        "  return goog.i18n.pluralRules.Keyword.OTHER;\n" +
        "};\n" +
        "\n" +
        "if (goog.LOCALE == 'fr') {\n" +
        "  goog.i18n.pluralRules.select = goog.i18n.pluralRules.frSelect_;\n" +
        "}"
        );
    var localeInfo = newTestLocaleInfo();
    closureI18nExtractor.pluralExtractor(content, localeInfo);
    var pluralCat = localeInfo["fr_CA"].pluralCat;
    expect(pluralCat).toBeDefined();
    // pluralCat is the source text for the pluralCat and contains @@
    // placeholders that need to be stripped before evaluation.
    // Ref: closureI18nExtractor.pluralExtractor.
    pluralCat = pluralCat.replace(/^@@|@@$/g, '');
    // pluralCat requires these constants to exist.
    var PLURAL_CATEGORY = {
      ZERO: "zero", ONE: "one", TWO: "two",
      FEW: "few", MANY: "many", OTHER: "other"
      };
    // Obtain the function by evaluating the source text.
    pluralCat = eval("(" + pluralCat + ")");
    // Confirm some expectations for pluralCat in fr_CA.
    expect(pluralCat(0)).toEqual("one");
    expect(pluralCat(3)).toEqual("other");
  })
});

describe("serializeContent", function() {
  it("should not make any modifications to the content of the locale", function() {
    var serializedContent = closureI18nExtractor.serializeContent(newTestLocaleInfo());
    expect(eval("(" + serializedContent + ")")).toEqual(newTestLocaleInfo());
  });
  it("should only have ascii characters", function() {
    var serializedContent = closureI18nExtractor.serializeContent(newTestLocaleInfo());
    expect((/[^\u0001-\u007f]/).test(serializedContent)).toBe(false);
  });
  it("should not transform arrays into objects", function() {
    var serializedContent = closureI18nExtractor.serializeContent(newTestLocaleInfo().fr_CA);
    var deserializedLocale = eval("(" + serializedContent + ")");
    expect(deserializedLocale.DATETIME_FORMATS.MONTH.length).not.toBe(undefined);
  });
});

