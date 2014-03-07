var converter = require('../src/converter.js');

describe("convertNumberData", function() {
  var convert = converter.convertNumberData,
      dataObj = { DECIMAL_SEP: ',',
                  GROUP_SEP: '.',
                  DECIMAL_PATTERN: '#,##0.###;#,##0.###-',
                  CURRENCY_PATTERN: '\u00A4#,##0.00;\u00A4#,##0.00-',
                  DEF_CURRENCY_CODE: 'USD' };

  it('should convert number object', function() {
    var processedData = convert(dataObj, {USD: ['x', '$', 'y']});
    expect(processedData.DECIMAL_SEP).toBe(',');
    expect(processedData.GROUP_SEP).toBe('.');
    expect(processedData.PATTERNS.length).toBe(2);
    expect(processedData.PATTERNS[0].gSize).toBe(3);
    expect(processedData.PATTERNS[0].negSuf).toBe('-');
    expect(processedData.CURRENCY_SYM).toBe('$');

    dataObj.DEF_CURRENCY_CODE = 'NoSuchCode';
    processedData = convert(dataObj, {});
    expect(processedData.CURRENCY_SYM).toBe('NoSuchCode');
  });
});


describe("convertDatetimeData", function() {
  var convert = converter.convertDatetimeData,
      dataObj = { MONTHS: ['Enero', 'Pebrero'],
                  SHORTMONTHS: ['Ene', 'Peb'],
                  WEEKDAYS: ['Linggo', 'Lunes'],
                  SHORTWEEKDAYS: ['Lin', 'Lun'],
                  AMPMS: ['AM', 'PM'],
                  DATEFORMATS: ['a', 'b', 'c', 'd'],
                  TIMEFORMATS: ['e', 'f', 'g', 'h'] };

  it('should convert empty datetime obj', function() {
    var processedData = convert(dataObj);
    expect(processedData.MONTH).toEqual(['Enero', 'Pebrero']);
    expect(processedData.SHORTMONTH).toEqual(['Ene', 'Peb']);
    expect(processedData.DAY).toEqual(['Linggo', 'Lunes']);
    expect(processedData.SHORTDAY).toEqual(['Lin', 'Lun']);
    expect(processedData.AMPMS).toEqual(['AM', 'PM']);
    expect(processedData.medium).toBe('c g');
    expect(processedData.short).toBe('d h');
    expect(processedData.fullDate).toBe('a');
    expect(processedData.longDate).toBe('b');
    expect(processedData.mediumDate).toBe('c');
    expect(processedData.shortDate).toBe('d');
    expect(processedData.mediumTime).toBe('g');
    expect(processedData.shortTime).toBe('h');
  });
});
