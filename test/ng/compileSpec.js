'use strict';


function calcCacheSize() {
  var size = 0;
  for(var key in jqLite.cache) { size++; }
  return size;
}


ddescribe('$compile', function() {
  var element, directive, $compile, $rootScope;

  beforeEach(module(provideLog, function($provide, $compileProvider){
    element = null;
    directive = $compileProvider.directive;

    directive('log', function(log) {
      return {
        restrict: 'CAM',
        priority:0,
        compile: valueFn(function(scope, element, attrs) {
          log(attrs.log || 'LOG');
        })
      };
    });

    directive('highLog', function(log) {
      return { restrict: 'CAM', priority:3, compile: valueFn(function(scope, element, attrs) {
        log(attrs.highLog || 'HIGH');
      })};
    });

    directive('mediumLog', function(log) {
      return { restrict: 'CAM', priority:2, compile: valueFn(function(scope, element, attrs) {
        log(attrs.mediumLog || 'MEDIUM');
      })};
    });

    directive('greet', function() {
      return { restrict: 'CAM', priority:10,  compile: valueFn(function(scope, element, attrs) {
        element.text("Hello " + attrs.greet);
      })};
    });

    directive('set', function() {
      return function(scope, element, attrs) {
        element.text(attrs.set);
      };
    });

    directive('mediumStop', valueFn({
      priority: 2,
      terminal: true
    }));

    directive('stop', valueFn({
      terminal: true
    }));

    directive('negativeStop', valueFn({
      priority: -100, // even with negative priority we still should be able to stop descend
      terminal: true
    }));

    directive('svgContainer', function() {
      return {
        template: '<svg width="400" height="400" ng-transclude></svg>',
        replace: true,
        transclude: true,
      };
    });

    directive('svgCircle', function(){
      return {
        template: '<circle cx="2" cy="2" r="1"></circle>',
        replace: true,
      };
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));


  function compile(html) {
    element = angular.element(html);
    $compile(element)($rootScope);
  }

  afterEach(function(){
    dealoc(element);
  });

  // this method assumes some sort of sized SVG element is being inspected.
  function isInvalidSvgElement(elem) {
    var unknownElement = Object.prototype.toString.call(elem) === '[object HTMLUnknownElement]';
    expect(unknownElement).toBe(false);
    var box = elem.getBoundingClientRect();
    return unknownElement || (box.width === 0 && box.height === 0);
  }

  describe('svg namespace', function() {
    it('should handle transcluded svg elements', inject(function($compile){
      element = jqLite('<div><svg-container>' +
        '<circle cx="4" cy="4" r="2"></circle>' +  
        '</svg-container></div>');  
      $compile(element.contents())($rootScope);

      document.body.appendChild(element[0]);
      
      var circle = element.find('circle');
      //dump(element)
      dump(circle[0])
      expect(isInvalidSvgElement(circle[0])).toBe(false);
    }));

    iit('should handle custom svg elements inside svg tag', function(){
      element = jqLite('<div><svg width="300" height="300">' +
        '<svg-circle></svg-circle>' +
        '</svg></div>');
      $compile(element.contents())($rootScope);
      document.body.appendChild(element[0]);

      var circle = element.find('circle');
      expect(isInvalidSvgElement(circle[0])).toBe(false);
    });

    it('should handle transcluded custom svg elements', function(){
      element = jqLite('<svg-container>' +
        '<svg-circle></svg-circle>' +
        '</svg-container>');
      $compile(element.contents())($rootScope);
      document.body.appendChild(element[0]);

      var circle = element.find('circle');
      expect(isInvalidSvgElement(circle[0])).toBe(false);
    });
  });

});
