'use strict';

describe('ngDir', function () {

  var element, $compile, $rootScope, $bidi, $locale;

  // a rtl text that gets ltr when adding any ltr word
  var WEAK_RTL_TEXT = 'someText \u05d0';
  var LTR_TEXT = 'someText';


  beforeEach(module(function ($sceProvider, $provide) {
    $locale = {};
    $provide.value('$locale', $locale);
    $sceProvider.enabled(false);
  }));

  beforeEach(inject(function (_$compile_, _$rootScope_, _$bidi_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $bidi = _$bidi_;
  }));

  afterEach(function () {
    dealoc(element);
  });

  describe('set dir property with ng-dir=locale', function() {

    it('should work for ltr', function () {
      $locale.id = 'en';
      element = $compile('<div ng-dir="locale"></div>')($rootScope);
      expect(element.attr('dir')).toBe('ltr');
    });

    it('should work for rtl', function () {
      $locale.id = 'ar';
      element = $compile('<div ng-dir="locale"></div>')($rootScope);
      expect(element.attr('dir')).toBe('rtl');
    });

  });

  describe('set dir property with ng-dir={{...}}', function() {

    it('should update the dir property', function () {
      $rootScope.dir = 'ltr';
      element = $compile('<div ng-dir="{{dir}}"></div>')($rootScope);
      $rootScope.$digest();

      $rootScope.dir = 'rtl';
      $rootScope.$digest();
      expect(element.attr('dir')).toBe('rtl');
    });

  });

  describe('set dir property with ng-dir=auto', function () {
    function testFixedValue(html) {
      element = $compile(html.replace('$$', ''))($rootScope);
      $rootScope.$digest();
      expect(element.prop('dir')).toBe('');

      element = $compile(html.replace('$$', LTR_TEXT))($rootScope);
      $rootScope.$digest();
      expect(element.prop('dir')).toBe('ltr');

      element = $compile(html.replace('$$', WEAK_RTL_TEXT))($rootScope);
      $rootScope.$digest();
      expect(element.prop('dir')).toBe('rtl');
    }

    function testDynamicValue(html, valueTemplate) {
      valueTemplate = valueTemplate || '$$';
      var scope = $rootScope.$new();
      scope.text = valueTemplate.replace('$$', '');
      element = $compile(html)(scope);
      scope.$digest();
      expect(element.prop('dir')).toBe('');

      scope.text = valueTemplate.replace('$$', LTR_TEXT);
      scope.$digest();
      expect(element.prop('dir')).toBe('ltr');

      scope.text = valueTemplate.replace('$$', WEAK_RTL_TEXT);
      scope.$digest();
      expect(element.prop('dir')).toBe('rtl');

      scope.$destroy();
      dealoc(element);
    }

    describe('text nodes', function(){

      it('should set the dir property depending on fixed text children', function () {
        testFixedValue('<div ng-dir="auto">$$</div>');
        testFixedValue('<div ng-dir="auto"><span>$$</span></div>');
      });

      it('should update the dir property depending on interpolated text', function () {
        testDynamicValue('<div ng-dir="auto">{{text}}</div>');
        testDynamicValue('<div ng-dir="auto"><span>{{text}}</span></div>');
      });

    });

    describe('ngBind', function() {

      it('should set the dir property for ngBind', function () {
        testDynamicValue('<span ng-dir="auto" ng-bind="text"></span>');
      });

      it('should set the dir property for a child ngBind', function () {
        testDynamicValue('<div ng-dir="auto"><span ng-bind="text"></span></div>');
      });

      it('should update the dir property correctly if there was text inside', function() {
        testDynamicValue('<div ng-dir="auto"><span ng-bind="text">'+LTR_TEXT+'</span></div>');
      });

    });

    describe('ngBindHtml', function() {

      it('should set the dir property for ngBindHtml', function () {
        testDynamicValue('<span ng-dir="auto" ng-bind-html="text"></span>', '<b> $$ </b>');
      });

      it('should set the dir property for child ngBindHtml', function () {
        testDynamicValue('<div ng-dir="auto"><span ng-bind-html="text"></span></div>', '<b> $$ </b>');
      });

      it('should update the dir property correctly if there was text inside', function() {
        testDynamicValue('<div ng-dir="auto"><span ng-bind-html="text">'+LTR_TEXT+'</span></div>', '<b> $$ </b>');
      });

    });

    describe('ngBindTemplate', function() {

      it('should set the dir property for ngBindTemplate', function () {
        testDynamicValue('<span ng-dir="auto" ng-bind-template="{{text}}"></span>');
      });

      it('should set the dir property for a child ngBindTemplate', function () {
        testDynamicValue('<div ng-dir="auto"><span ng-bind-template="{{text}}"></span></div>');
      });

      it('should update the dir property correctly if there was text inside', function() {
        testDynamicValue('<div ng-dir="auto"><span ng-bind-template="{{text}}">'+LTR_TEXT+'</span></div>');
      });

    });

    describe('input', function() {

      it('should set the dir property for input with ngModel', function () {
        testDynamicValue('<input ng-dir="auto" type="text" ng-model="text">');
        testDynamicValue('<div ng-dir="auto"><input type="text" ng-model="text"></div>');
      });

      it('should set the dir property for input with ngModel when the user types', function () {
        element = $compile('<input ng-dir="auto" type="text" ng-model="text">')($rootScope);
        $rootScope.$digest();
        expect(element.prop('dir')).toBe('');

        element.val(LTR_TEXT);
        browserTrigger(element, 'change');
        expect(element.prop('dir')).toBe('ltr');

        element.val(WEAK_RTL_TEXT);
        browserTrigger(element, 'change');
        expect(element.prop('dir')).toBe('rtl');
      });

      it('should set the dir property for a fixed value', function() {
        testFixedValue('<input type="text" ng-dir="auto" value="$$">');
        testFixedValue('<div ng-dir="auto"><input type="text" value="$$"></div>');
      });

      it('should set the dir property for an interpolated value', function() {
        testDynamicValue('<input type="text" ng-dir="auto" value="{{text}}">');
        testDynamicValue('<div ng-dir="auto"><input type="text" value="{{text}}"></div>');
      });
    });

    describe('textarea', function() {

      it('should set the dir property for textarea with ngModel', function () {
        testDynamicValue('<textarea ng-dir="auto" ng-model="text"></textarea>');
        testDynamicValue('<div ng-dir="auto"><textarea ng-model="text"></textarea></div>');
      });

      it('should set the dir property for a fixed value', function() {
        testFixedValue('<textarea ng-dir="auto">$$</textarea>');
        testFixedValue('<div ng-dir="auto"><textarea>$$</textarea></div>');
      });

      it('should set the dir property for an interpolated value', function() {
        testDynamicValue('<textarea ng-dir="auto" value="{{text}}"></textarea>');
        testDynamicValue('<div ng-dir="auto"><textarea value="{{text}}"></textarea></div>');
      });
    });

    describe('child scopes', function() {

      it('should throw if an interpolation is used in a child scope of dir=ng-auto', function() {
        var scope = $rootScope.$new();
        var element = jqLite('<div><div ng-dir="auto"><span ng-if="true">{{}}</span></div></div>');
        expect(function() {
          $compile(element)(scope);
          scope.$digest();
        }).toThrowMinErr('dirNgAuto', 'childscope');
        dealoc(element);
        scope.$destroy();
      });

      it('should not throw if ng-dir="auto" is part of an element with template directive', function() {
        element = $compile('<div><div ng-dir="auto" ng-if="true">{{}}</div></div>')($rootScope);
        $rootScope.$digest();
      });

    });

  });

});
