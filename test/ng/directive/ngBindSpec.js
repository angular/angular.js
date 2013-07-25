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
  });


  describe('ngBindTemplate', function() {

    it('should ngBindTemplate', inject(function($rootScope, $compile) {
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


  describe('ngBindHtmlUnsafe', function() {

    function configureSce(enabled) {
      module(function($provide, $sceProvider) {
        $sceProvider.enabled(enabled);
      });
    };

    describe('SCE disabled', function() {
      beforeEach(function() {configureSce(false)});

      it('should set unsafe html', inject(function($rootScope, $compile) {
        element = $compile('<div ng-bind-html-unsafe="html"></div>')($rootScope);
        $rootScope.html = '<div onclick="">hello</div>';
        $rootScope.$digest();
        expect(angular.lowercase(element.html())).toEqual('<div onclick="">hello</div>');
      }));
    });


    describe('SCE enabled', function() {
      beforeEach(function() {configureSce(true)});

      it('should NOT set unsafe html for untrusted values', inject(function($rootScope, $compile) {
        element = $compile('<div ng-bind-html-unsafe="html"></div>')($rootScope);
        $rootScope.html = '<div onclick="">hello</div>';
        expect($rootScope.$digest).toThrow();
      }));

      it('should NOT set unsafe html for wrongly typed values', inject(function($rootScope, $compile, $sce) {
        element = $compile('<div ng-bind-html-unsafe="html"></div>')($rootScope);
        $rootScope.html = $sce.trustAsCss('<div onclick="">hello</div>');
        expect($rootScope.$digest).toThrow();
      }));

      it('should set unsafe html for trusted values', inject(function($rootScope, $compile, $sce) {
        element = $compile('<div ng-bind-html-unsafe="html"></div>')($rootScope);
        $rootScope.html = $sce.trustAsHtml('<div onclick="">hello</div>');
        $rootScope.$digest();
        expect(angular.lowercase(element.html())).toEqual('<div onclick="">hello</div>');
      }));

    });

  });
});
