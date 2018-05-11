'use strict';


describe('ngDefer', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  it('should defer compilation of the owning element and its children',
    inject(function($rootScope, $compile) {
      element = $compile('<div ng-init="run = false">' +
                         '  <span id="s1">{{a}}</span>' +
                         '  <span id="s2" ng-bind="b"></span>' +
                         '  <div foo="{{a}}" ng-defer="run == true">' +
                         '    <span ng-bind="a"></span>{{b}}' +
                         '  </div>' +
                         '  <span id="s3">{{a}}</span>' +
                         '  <span id="s4" ng-bind="b"></span>' +
                         '  <a id="run-link" ng-click="run = true">Run deferred</a>' +
                         '</div>')($rootScope);
      $rootScope.a = 'one';
      $rootScope.b = 'two';
      $rootScope.$digest();
      // Bindings not contained by ng-non-bindable should resolve.
      var spans = element.find('span');
      expect(spans.eq(0).text()).toEqual('one');
      expect(spans.eq(1).text()).toEqual('two');
      expect(spans.eq(3).text()).toEqual('one');
      expect(spans.eq(4).text()).toEqual('two');
      // Bindings contained by ng-non-bindable should be left alone.
      var ngDeferDiv = element.find('div');
      expect(ngDeferDiv.attr('foo')).toEqual('{{a}}');
      expect(trim(ngDeferDiv.text())).toEqual('{{b}}');
      var link = element.find('a');
      browserTrigger(link, 'click');
      expect(ngDeferDiv.attr('foo')).toEqual('one');
      expect(trim(ngDeferDiv.text())).toEqual('onetwo');
    })
  );
});
