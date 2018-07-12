'use strict';


describe('ngNonBindable', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  it('should prevent compilation of the owning element and its children',
      inject(function($rootScope, $compile) {
    element = $compile('<div ng-non-bindable text="{{name}}"><span ng-bind="name"></span></div>')($rootScope);
    element = $compile('<div>' +
                       '  <span id="s1">{{a}}</span>' +
                       '  <span id="s2" ng-bind="b"></span>' +
                       '  <div foo="{{a}}" ng-non-bindable>' +
                       '    <span ng-bind="a"></span>{{b}}' +
                       '  </div>' +
                       '  <span id="s3">{{a}}</span>' +
                       '  <span id="s4" ng-bind="b"></span>' +
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
    var nonBindableDiv = element.find('div');
    expect(nonBindableDiv.attr('foo')).toEqual('{{a}}');
    expect(trim(nonBindableDiv.text())).toEqual('{{b}}');
  }));
});
