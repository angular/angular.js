ExternalApiTest = TestCase("ExternalApiTest");

ExternalApiTest.prototype = {
  testItShouldExposefactory:function(){
    var node = $('<div ng-init="a=1">{{b=a+1}}</div>')[0];
    var settings = {};
    var angular = angularFactory(settings);
    var scope = angular.compile(node);
    assertEquals(1, scope.get('a'));
    assertEquals(2, scope.get('b'));
  }
};
