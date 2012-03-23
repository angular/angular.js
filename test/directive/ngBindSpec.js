'use strict';

describe('ng-bind-*', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  describe('ng-bind', function() {

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

    it('should set html', inject(function($rootScope, $compile) {
      element = $compile('<div ng-bind-html="html"></div>')($rootScope);
      $rootScope.html = '<div unknown>hello</div>';
      $rootScope.$digest();
      expect(lowercase(element.html())).toEqual('<div>hello</div>');
    }));

    it('should set unsafe html', inject(function($rootScope, $compile) {
      element = $compile('<div ng-bind-html-unsafe="html"></div>')($rootScope);
      $rootScope.html = '<div onclick="">hello</div>';
      $rootScope.$digest();
      expect(lowercase(element.html())).toEqual('<div onclick="">hello</div>');
    }));

    it('should suppress rendering of falsy values', inject(function($rootScope, $compile) {
      element = $compile('<div>{{ null }}{{ undefined }}{{ "" }}-{{ 0 }}{{ false }}</div>')($rootScope);
      $rootScope.$digest();
      expect(element.text()).toEqual('-0false');
    }));

    it('should render object as JSON ignore $$', inject(function($rootScope, $compile) {
      element = $compile('<div>{{ {key:"value", $$key:"hide"}  }}</div>')($rootScope);
      $rootScope.$digest();
      expect(fromJson(element.text())).toEqual({key:'value'});
    }));
  });


  describe('ng-bind-template', function() {

    it('should ng-bind-template', inject(function($rootScope, $compile) {
      element = $compile('<div ng-bind-template="Hello {{name}}!"></div>')($rootScope);
      $rootScope.name = 'Misko';
      $rootScope.$digest();
      expect(element.hasClass('ng-binding')).toEqual(true);
      expect(element.text()).toEqual('Hello Misko!');
    }));

    it('should render object as JSON ignore $$', inject(function($rootScope, $compile) {
      element = $compile('<pre>{{ {key:"value", $$key:"hide"}  }}</pre>')($rootScope);
      $rootScope.$digest();
      expect(fromJson(element.text())).toEqual({key:'value'});
    }));
  });
});
