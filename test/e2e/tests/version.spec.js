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

  it('should not contain "NG_VERSION_" in `codeName`', function() {
    expect(version.then(get('codeName'))).not.toMatch(/NG_VERSION_/);
  });

  it('\'s `full` property should start with `"major.minor.dot"`', function() {
    expect(version.then(validate)).toBe(true);

    function validate(ver) {
      // We test for "starts with", because `full` is not always equal to `"major.minor.dot"`.
      // Possible formats: `1.5.8`, `1.5.0-rc.2`, `1.5.9-build.4949`, `1.5.9-local+sha.859348c`
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
