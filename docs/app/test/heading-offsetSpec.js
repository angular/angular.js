describe("heading-offset", function() {
  describe("id directive", function() {

    var $compile, $scope;

    beforeEach(module('heading-offset'));

    beforeEach(inject(function($rootScope, _$compile_) {
      $scope = $rootScope;
      $compile = _$compile_;
    }));

    it("should inject a span into headings with ids", function() {
      var element = $compile('<h1 id="some-id"></h1>')($scope);
      var span = element.children();
      expect(span[0].nodeName).toMatch(/span/i);
      expect(element.attr('id')).toBeUndefined();
      expect(span.attr('id')).toBe('some-id');
    });

    it("should inject a span into anchors with ids", function() {
      var element = $compile('<a id="some-id"></a>')($scope);
      var span = element.children();
      expect(span[0].nodeName).toMatch(/span/i);
      expect(element.attr('id')).toBeUndefined();
      expect(span.attr('id')).toBe('some-id');
    });

  });
});