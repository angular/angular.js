require.paths.push(__dirname + '/../i18n/');

var converter = require('converter');

describe("convertNumberData", function() {
  var convert = converter.convertNumberData,
      dataObj = { DECIMAL_SEP: ',',
                  GROUP_SEP: '.',
                  DECIMAL_PATTERN: '#,##0.###;#,##0.###-',
                  CURRENCY_PATTERN: '\u00A4#,##0.00;\u00A4#,##0.00-',
                  DEF_CURRENCY_CODE: 'USD' };

  it('should convert number object', function() {
    var processedData = convert(dataObj);
    expect(processedData.DECIMAL_SEP).toBe(',');
    expect(processedData.GROUP_SEP).toBe('.');
    expect(processedData.PATTERNS.length).toBe(2);
    expect(processedData.PATTERNS[0].gSize).toBe(3);
    expect(processedData.PATTERNS[0].negSuf).toBe('-');
    expect(processedData.CURRENCY_SYM).toBe('$');

    dataObj.DEF_CURRENCY_CODE = 'NoSuchCode';
    processedData = convert(dataObj);
    expect(processedData.CURRENCY_SYM).toBe('NoSuchCode');
  });
});


describe("convertDatetimeData", function() {
  var convert = converter.convertDatetimeData,
      dataObj = { MONTHS: ['Enero', 'Pebrero'],
                  SHORTMONTHS: ['Ene', 'Peb'],
                  WEEKDAYS: ['Linggo', 'Lunes'],
                  SHORTWEEKDAYS: ['Lin', 'Lun'],
                  AMPMS: ['AM', 'PM'] };

  it('should convert empty datetime obj', function() {
    var processedData = convert(dataObj);
    expect(processedData.MONTHS).toEqual(['Enero', 'Pebrero']);
    expect(processedData.SHORTMONTHS).toEqual(['Ene', 'Peb']);
    expect(processedData.WEEKDAYS).toEqual(['Linggo', 'Lunes']);
    expect(processedData.SHORTWEEKDAYS).toEqual(['Lin', 'Lun']);
    expect(processedData.AMPMS).toEqual(['AM', 'PM']);
  });

  describe("convertDatetimeFormats", function() {
    var convert = converter.convertDatetimeFormats;

    it('should generate full, long, medium, short datetime formats', function() {
      var dateFormats = ['a', 'b', 'c', 'd'],
          timeFormats = ['e', 'f', 'g', 'h'],
          datetimeFormats = {};
      convert(datetimeFormats, dateFormats, timeFormats);
      expect(datetimeFormats.long).toBe('b f');
      expect(datetimeFormats.medium).toBe('c g');
      expect(datetimeFormats.short).toBe('d h');
      expect(datetimeFormats.fullDate).toBe('a');
      expect(datetimeFormats.longDate).toBe('b');
      expect(datetimeFormats.mediumDate).toBe('c');
      expect(datetimeFormats.shortDate).toBe('d');
      expect(datetimeFormats.longTime).toBe('f');
      expect(datetimeFormats.mediumTime).toBe('g');
      expect(datetimeFormats.shortTime).toBe('h');
    });
  });
})
