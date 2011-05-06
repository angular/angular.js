describe('$invalidWidgets', function() {
  var scope;

  beforeEach(function(){
    scope = angular.scope();
  });


  afterEach(function(){
    dealoc(scope);
  });


  it("should count number of invalid widgets", function(){
    var element = jqLite('<input name="price" ng:required ng:validate="number">');
    jqLite(document.body).append(element);
    scope = compile(element)();
    var $invalidWidgets = scope.$service('$invalidWidgets');
    expect($invalidWidgets.length).toEqual(1);

    scope.price = 123;
    scope.$eval();
    expect($invalidWidgets.length).toEqual(0);

    scope.$element.remove();
    scope.price = 'abc';
    scope.$eval();
    expect($invalidWidgets.length).toEqual(0);

    jqLite(document.body).append(scope.$element);
    scope.price = 'abcd'; //force revalidation, maybe this should be done automatically?
    scope.$eval();
    expect($invalidWidgets.length).toEqual(1);

    jqLite(document.body).html('');
    scope.$eval();
    expect($invalidWidgets.length).toEqual(0);
  });
});
