describe("heading-offset", function() {
  describe("id directive", function() {

    function check(element, child, offset, id) {
      expect(child[0].nodeName).toMatch(/div/i);
      expect(element.attr('id')).toBeUndefined();
      expect(child.attr('id')).toEqual(id);
      expect(child.css('margin-top')).toEqual('-'+offset);
      expect(child.css('height')).toEqual(offset);
    }

    var $compile, $scope, headingOffset;

    beforeEach(module('heading-offset'));

    beforeEach(inject(function($rootScope, _$compile_, _headingOffset_) {
      $scope = $rootScope;
      $compile = _$compile_;
      headingOffset = _headingOffset_;
      headingOffset.value = '40px';
    }));

    it("should inject a child into headings with ids, while watching the headerOffset service value", function() {
      var element = $compile('<h1 id="some-id"></h1>')($scope);
      var child = element.children();
      $scope.$digest();

      check(element, child, '40px', 'some-id');

      headingOffset.value = '100px';
      $scope.$digest();

      check(element, child, '100px', 'some-id');
    });

    it("should inject a child into anchors with ids, while watching the headerOffset service value", function() {
      var element = $compile('<a id="some-id"></a>')($scope);
      var child = element.children();
      $scope.$digest();

      check(element, child, '40px', 'some-id');

      headingOffset.value = '100px';
      $scope.$digest();

      check(element, child, '100px', 'some-id');
    });


    it("should inject a child into heading elements, while observing the ngOffset attribute", function() {
      var element = $compile('<h2 id="some-id" ng-offset="{{ x }}"></h2>')($scope);
      var child = element.children();
      $scope.$digest();

      check(element, child, '40px', 'some-id');

      $scope.x = '50px';
      $scope.$digest();

      check(element, child, '50px', 'some-id');

      $scope.x = null;
      $scope.$digest();

      check(element, child, '40px', 'some-id');
    });

    it("should inject a child into non-heading elements, while observing the ngOffset attribute", function() {
      var element = $compile('<li id="some-id" ng-offset="{{ x }}"></li>')($scope);
      var child = element.children();

      $scope.$digest();

      check(element, child, '40px', 'some-id');

      $scope.x = '50px';
      $scope.$digest();

      check(element, child, '50px', 'some-id');

      $scope.x = null;
      $scope.$digest();

      check(element, child, '40px', 'some-id');
    });

  });
});