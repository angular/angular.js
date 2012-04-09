'use strict';


describe('ngNonBindable', function() {
  var element;


  afterEach(function(){
    dealoc(element);
  });


  it('should prevent compilation of the owning element and its children',
      inject(function($rootScope, $compile) {
    element = $compile('<div ng-non-bindable text="{{name}}"><span ng-bind="name"></span></div>')($rootScope);
    $rootScope.name =  'misko';
    $rootScope.$digest();
    expect(element.text()).toEqual('');
    expect(element.attr('text')).toEqual('{{name}}');
  }));
});
