'use strict';

describe('bindOnce directives', function() {
  var scope, $compile;

  beforeEach(inject(function($injector) {
    $compile = $injector.get('$compile');
    scope = $injector.get('$rootScope');
  }));


  describe('Creating ngBindOnce* directive', function() {
    
      angular.forEach(['text','src','href','id','class','alt','value','title'], function(v){

        var bindOnceNode;

        beforeEach(function(){
            scope.testValue = 'tester+tester+tester';
            bindOnceNode = $compile('<div ng-bind-once-' + v + '="testValue"></div>')(scope);
            scope.$apply();
            expect(bindOnceNode).not.toBe(undefined);
        }); 
        
        it('should have the correct values for the bindOnce directive', function() {
          if(v === 'text'){
            expect(bindOnceNode[v]()).toBe('tester+tester+tester');
          } else if(v === 'class'){
            expect(bindOnceNode.hasClass('tester+tester+tester')).toBe(true);
          } else {
            expect(bindOnceNode.attr(v)).toBe('tester+tester+tester');
          }
        });

        it('should not have any watchers on the scope', function() {
          expect(scope.$$watchers.length).toBe(0);
        });
      });

  });

  describe('Creating ngBindOnceHtml and ngBindOnceStyle directives', function() {
        
        it('should set the correct html to the element and destroy the watchers', function() {
          scope.testValue = '<p>No Bindings</p>';
          var bindOnceHtmlNode = $compile('<div ng-bind-once-html="testValue"></div>')(scope);
          scope.$apply();
          expect(bindOnceHtmlNode.html()).toBe('<p>No Bindings</p>'); 
          expect(scope.$$watchers.length).toBe(0);  
        });

        it('should set the correct style to the element and destroy the watchers', function() {
          scope.testValue = {width: '100px', height: '200px'};
          var bindOnceStyleNode = $compile('<div ng-bind-once-style="testValue"></div>')(scope);
          scope.$apply();
          expect(bindOnceStyleNode.css('height')).toBe('200px'); 
          expect(bindOnceStyleNode.css('width')).toBe('100px'); 
          expect(scope.$$watchers.length).toBe(0);  
        });

  });
});
