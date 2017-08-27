'use strict';

var generateCodeModule = require('../src/generateCode.js');
var generateCode = generateCodeModule.generateCode;
var generateFunction = generateCodeModule.generateFunction;

describe('generateFunction', function() {
  it('should generate function with ranges', function() {
    expect(generateFunction([['0001', '0003']], 'IDS_Y')).toEqual('\
function IDS_Y(cp) {\n\
  if (0x0001 <= cp && cp <= 0x0003) return true;\n\
  return false;\n\
}\n');
  });

  it('should generate function with multiple ranges', function() {
    expect(generateFunction([['0001', '0003'], ['0005', '0009']], 'IDS_Y')).toEqual('\
function IDS_Y(cp) {\n\
  if (0x0001 <= cp && cp <= 0x0003) return true;\n\
  if (0x0005 <= cp && cp <= 0x0009) return true;\n\
  return false;\n\
}\n');
  });

  it('should generate function with unique values', function() {
    expect(generateFunction([['0001', '0001'], ['0005', '0009']], 'IDS_Y')).toEqual('\
function IDS_Y(cp) {\n\
  if (cp === 0x0001) return true;\n\
  if (0x0005 <= cp && cp <= 0x0009) return true;\n\
  return false;\n\
}\n');
  });
});

describe('generateCode', function() {
  it('should generate the function for all the values', function() {
    expect(generateCode({ IDS_Y : [['0001', '0001'], ['0006', '0006']], IDC_Y : [['0002', '0002'], ['0007', '0007']] })).toEqual('\
/******************************************************\n\
 *         Generated file, do not modify              *\n\
 *                                                    *\n\
 *****************************************************/\n\
"use strict";\n\
function IDS_Y(cp) {\n\
  if (cp === 0x0001) return true;\n\
  if (cp === 0x0006) return true;\n\
  return false;\n\
}\n\
function IDC_Y(cp) {\n\
  if (cp === 0x0002) return true;\n\
  if (cp === 0x0007) return true;\n\
  return false;\n\
}\n\
');
  });
});
