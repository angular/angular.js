describe('json', function() {

  it('angular parser', function() {
    perf(
      function angular() {
        fromJson(largeJsonString);
      },
      function nativeDelegate() {
        fromJson(largeJsonString, true);
      },
      function nativeJSON() {
        JSON.parse(largeJsonString);
      }
    );
  });
});
