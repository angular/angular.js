'use strict';


describe('ng:non-bindable', function() {
  var element;


  afterEach(function(){
    dealoc(element);
  });


  it('should prevent compilation of the owning element and its children',
      inject(function($rootScope, $compile) {
    element = $compile('<div ng:non-bindable><span ng:bind="name"></span></div>')($rootScope);
    $rootScope.name =  'misko';
    $rootScope.$digest();
    expect(element.text()).toEqual('');
  }));
});
