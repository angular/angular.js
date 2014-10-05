'use strict';

describe('ngBind*', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  describe('ngBind', function() {

    it('should set text', inject(function($rootScope, $compile) {
      element = $compile('<div ng-bind="a"></div>')($rootScope);
      expect(element.text()).toEqual('');
      $rootScope.a = 'misko';
      $rootScope.$digest();
      expect(element.hasClass('ng-binding')).toEqual(true);
      expect(element.text()).toEqual('misko');
    }));


    it('should set text to blank if undefined', inject(function($rootScope, $compile) {
      element = $compile('<div ng-bind="a"></div>')($rootScope);
      $rootScope.a = 'misko';
      $rootScope.$digest();
      expect(element.text()).toEqual('misko');
      $rootScope.a = undefined;
      $rootScope.$digest();
      expect(element.text()).toEqual('');
      $rootScope.a = null;
      $rootScope.$digest();
      expect(element.text()).toEqual('');
    }));


    it('should suppress rendering of falsy values', inject(function($rootScope, $compile) {
      element = $compile('<div><span ng-bind="null"></span>' +
                              '<span ng-bind="undefined"></span>' +
                              '<span ng-bind="\'\'"></span>-' +
                              '<span ng-bind="0"></span>' +
                              '<span ng-bind="false"></span>' +
                          '</div>')($rootScope);
      $rootScope.$digest();
      expect(element.text()).toEqual('-0false');
    }));

    it('should one-time bind if the expression starts with two colons', inject(function($rootScope, $compile) {
      element = $compile('<div ng-bind="::a"></div>')($rootScope);
      $rootScope.a = 'lucas';
      expect($rootScope.$$watchers.length).toEqual(1);
      $rootScope.$digest();
      expect(element.text()).toEqual('lucas');
      expect($rootScope.$$watchers.length).toEqual(0);
      $rootScope.a = undefined;
      $rootScope.$digest();
      expect(element.text()).toEqual('lucas');
    }));

    it('should be possible to bind to a new value within the same $digest', inject(function($rootScope, $compile) {
      element = $compile('<div ng-bind="::a"></div>')($rootScope);
      $rootScope.$watch('a', function(newVal) { if (newVal === 'foo') { $rootScope.a = 'bar'; } });
      $rootScope.a = 'foo';
      $rootScope.$digest();
      expect(element.text()).toEqual('bar');
      $rootScope.a = undefined;
      $rootScope.$digest();
      expect(element.text()).toEqual('bar');
    }));

    it('should remove the binding if the value is defined at the end of a $digest loop', inject(function($rootScope, $compile) {
      element = $compile('<div ng-bind="::a"></div>')($rootScope);
      $rootScope.$watch('a', function(newVal) { if (newVal === 'foo') { $rootScope.a = undefined; } });
      $rootScope.a = 'foo';
      $rootScope.$digest();
      expect(element.text()).toEqual('');
      $rootScope.a = 'bar';
      $rootScope.$digest();
      expect(element.text()).toEqual('bar');
      $rootScope.a = 'man';
      $rootScope.$digest();
      expect(element.text()).toEqual('bar');
    }));
  });


  describe('ngBindTemplate', function() {

    it('should ngBindTemplate', inject(function($rootScope, $compile) {
      element = $compile('<div ng-bind-template="Hello {{name}}!"></div>')($rootScope);
      $rootScope.name = 'Misko';
      $rootScope.$digest();
      expect(element.hasClass('ng-binding')).toEqual(true);
      expect(element.text()).toEqual('Hello Misko!');
    }));


    it('should one-time bind the expressions that start with ::', inject(function($rootScope, $compile) {
      element = $compile('<div ng-bind-template="{{::hello}} {{::name}}!"></div>')($rootScope);
      $rootScope.name = 'Misko';
      expect($rootScope.$$watchers.length).toEqual(2);
      $rootScope.$digest();
      expect(element.hasClass('ng-binding')).toEqual(true);
      expect(element.text()).toEqual(' Misko!');
      expect($rootScope.$$watchers.length).toEqual(1);
      $rootScope.hello = 'Hello';
      $rootScope.name = 'Lucas';
      $rootScope.$digest();
      expect(element.text()).toEqual('Hello Misko!');
      expect($rootScope.$$watchers.length).toEqual(0);
    }));


    it('should render object as JSON ignore $$', inject(function($rootScope, $compile) {
      element = $compile('<pre>{{ {key:"value", $$key:"hide"}  }}</pre>')($rootScope);
      $rootScope.$digest();
      expect(fromJson(element.text())).toEqual({key:'value'});
    }));
  });


  describe('ngBindHtml', function() {

    it('should complain about accidental use of interpolation', inject(function($compile) {
      expect(function() {
        $compile('<div ng-bind-html="{{myHtml}}"></div>');
      }).toThrowMinErr('$parse', 'syntax',
        "Syntax Error: Token '{' invalid key at column 2 of the expression [{{myHtml}}] starting at [{myHtml}}]");
    }));


    describe('SCE disabled', function() {
      beforeEach(function() {
        module(function($sceProvider) { $sceProvider.enabled(false); });
      });

      it('should set html', inject(function($rootScope, $compile) {
        element = $compile('<div ng-bind-html="html"></div>')($rootScope);
        $rootScope.html = '<div onclick="">hello</div>';
        $rootScope.$digest();
        expect(angular.lowercase(element.html())).toEqual('<div onclick="">hello</div>');
      }));

      it('should one-time bind if the expression starts with two colons', inject(function($rootScope, $compile) {
        element = $compile('<div ng-bind-html="::html"></div>')($rootScope);
        $rootScope.html = '<div onclick="">hello</div>';
        expect($rootScope.$$watchers.length).toEqual(1);
        $rootScope.$digest();
        expect(element.text()).toEqual('hello');
        expect($rootScope.$$watchers.length).toEqual(0);
        $rootScope.html = '<div onclick="">hello</div>';
        $rootScope.$digest();
        expect(element.text()).toEqual('hello');
      }));
    });


    describe('SCE enabled', function() {
      it('should NOT set html for untrusted values', inject(function($rootScope, $compile) {
        element = $compile('<div ng-bind-html="html"></div>')($rootScope);
        $rootScope.html = '<div onclick="">hello</div>';
        expect(function() { $rootScope.$digest(); }).toThrow();
      }));

      it('should NOT set html for wrongly typed values', inject(function($rootScope, $compile, $sce) {
        element = $compile('<div ng-bind-html="html"></div>')($rootScope);
        $rootScope.html = $sce.trustAsCss('<div onclick="">hello</div>');
        expect(function() { $rootScope.$digest(); }).toThrow();
      }));

      it('should set html for trusted values', inject(function($rootScope, $compile, $sce) {
        element = $compile('<div ng-bind-html="html"></div>')($rootScope);
        $rootScope.html = $sce.trustAsHtml('<div onclick="">hello</div>');
        $rootScope.$digest();
        expect(angular.lowercase(element.html())).toEqual('<div onclick="">hello</div>');
      }));

      it('should watch the string value to avoid infinite recursion', inject(function($rootScope, $compile, $sce) {
        // Ref: https://github.com/angular/angular.js/issues/3932
        // If the binding is a function that creates a new value on every call via trustAs, we'll
        // trigger an infinite digest if we don't take care of it.
        element = $compile('<div ng-bind-html="getHtml()"></div>')($rootScope);
        $rootScope.getHtml = function() {
          return $sce.trustAsHtml('<div onclick="">hello</div>');
        };
        $rootScope.$digest();
        expect(angular.lowercase(element.html())).toEqual('<div onclick="">hello</div>');
      }));

      describe('when $sanitize is available', function() {
        beforeEach(function() { module('ngSanitize'); });

        it('should sanitize untrusted html', inject(function($rootScope, $compile) {
          element = $compile('<div ng-bind-html="html"></div>')($rootScope);
          $rootScope.html = '<div onclick="">hello</div>';
          $rootScope.$digest();
          expect(angular.lowercase(element.html())).toEqual('<div>hello</div>');
        }));
      });
    });

  });
});
