describe('json', function() {

  it('angular parser', function() {
    var duration = time(function() {
      expect(angular.fromJson(largeJsonString)).toBeTruthy();
    }, 1);

    dump(duration/1 + ' ms per iteration');
  });


  it('angular delegating to native parser', function() {
    var duration = time(function() {
      expect(angular.fromJson(largeJsonString, true)).toBeTruthy();
    }, 100);

    dump(duration/100 + ' ms per iteration');
  });


  it('native json', function() {
    var duration = time(function() {
      expect(JSON.parse(largeJsonString)).toBeTruthy();
    }, 100);

    dump(duration/100 + ' ms per iteration');
  });
});
