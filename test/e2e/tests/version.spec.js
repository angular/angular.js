'use strict';

describe('angular.version', function() {
  var version;

  beforeEach(function() {
    loadFixture('version');
    version = browser.driver.executeScript('return angular.version');
  });


  it('should expose the current version as object', function() {
    expect(version).toEqual(jasmine.any(Object));
  });

  it('should contain property `full` (string)', function() {
    expect(version.then(get('full'))).toEqual(jasmine.any(String));
  });

  it('should contain property `major` (number)', function() {
    expect(version.then(get('major'))).toEqual(jasmine.any(Number));
  });

  it('should contain property `minor` (number)', function() {
    expect(version.then(get('minor'))).toEqual(jasmine.any(Number));
  });

  it('should contain property `dot` (number)', function() {
    expect(version.then(get('dot'))).toEqual(jasmine.any(Number));
  });

  it('should contain property `codeName` (string)', function() {
    expect(version.then(get('codeName'))).toEqual(jasmine.any(String));
  });

  it('should have `full` === `"major.minor.dot"`', function() {
    expect(version.then(validate)).toBe(true);

    function validate(ver) {
      return ver.full.indexOf([ver.major, ver.minor, ver.dot].join('.')) === 0;
    }
  });


  // Helpers
  function get(prop) {
    return function getter(obj) {
      return obj[prop];
    };
  }
});
