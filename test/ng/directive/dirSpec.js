'use strict';

describe('ngDir', function () {

  var element, $compile, $rootScope, $bidi, $locale;

  var RTL_TEXT = '\u05d0';
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
      element = $compile('<div dir="locale"></div>')($rootScope);
      expect(element.attr('dir')).toBe('ltr');
    });

    it('should work for rtl', function () {
      $locale.id = 'ar';
      element = $compile('<div dir="locale"></div>')($rootScope);
      expect(element.attr('dir')).toBe('rtl');
    });

  });

  describe('text interpolation', function() {
    it('should update the text node when the dir is the same for ltr text', function() {
      element = $compile('<div dir="ltr">a{{someVar}}</div>')($rootScope);
      $rootScope.someVar = LTR_TEXT ;
      $rootScope.$digest();
      expect(element.html()).toBe('a'+LTR_TEXT);
      expect(element[0].childNodes.length).toBe(1);
    });

    it('should update the text node when the dir is the same for rtl text', function() {
      element = $compile('<div dir="rtl">{{someVar}}</div>')($rootScope);
      $rootScope.someVar = RTL_TEXT ;
      $rootScope.$digest();
      expect(element.html()).toBe(RTL_TEXT);
      expect(element[0].childNodes.length).toBe(1);
    });

    it('should reuse an existing text node if no wrapping is needed', function() {
      element = $compile('<div dir="ltr">a{{someVar}}</div>')($rootScope);
      var textNode = element[0].childNodes[0];
      $rootScope.someVar = LTR_TEXT ;
      $rootScope.$digest();
      expect(element[0].childNodes[0]).toBe(textNode);
    });

    it('should wrap text into spans when dir differs for ltr text', function() {
      element = $compile('<div dir="rtl">a{{someVar}}</div>')($rootScope);
      $rootScope.someVar = LTR_TEXT ;
      $rootScope.$digest();
      expect(element.html()).toBe('a<span dir="ltr">'+LTR_TEXT+'</span>');
    });

    it('should wrap text into spans when dir differs for rtl text', function() {
      element = $compile('<div dir="ltr">a{{someVar}}</div>')($rootScope);
      $rootScope.someVar = RTL_TEXT;
      $rootScope.$digest();
      expect(element.html()).toBe('a<span dir="rtl">'+RTL_TEXT+'</span>');
    });

    it('should reuse an existing span when wrapping', function() {
      element = $compile('<div dir="rtl">{{someVar}}</div>')($rootScope);
      $rootScope.someVar = LTR_TEXT;
      $rootScope.$digest();
      var span = element[0].childNodes[0];
      $rootScope.someVar = LTR_TEXT+'2';
      $rootScope.$digest();
      expect(element[0].childNodes[0]).toBe(span);
    });

    it('should not wrap rtl text outside of interpolation', function() {
      element = $compile('<div dir="ltr">{{someVar}}'+RTL_TEXT+'</div>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toBe(RTL_TEXT);
    });

    it('should ignore empty expressions', function() {
      element = $compile('<div dir="rtl">a{{a}}b</div>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toBe('ab');
      expect(element[0].childNodes.length).toBe(1);
    });

    it('should merge sibling expressions with the same directionality', function() {
      element = $compile('<div dir="rtl">{{a}}{{b}}</div>')($rootScope);
      $rootScope.a = '1';
      $rootScope.b = '2';
      $rootScope.$digest();
      expect(element.html()).toBe('<span dir="ltr">12</span>');
      expect(element[0].childNodes.length).toBe(1);
    });

    it('should add a correcting unicode embedding after wrapping when there is more text', function() {
      element = $compile('<div dir="rtl">{{a}}b</div>')($rootScope);
      $rootScope.a = '1';
      $rootScope.$digest();
      expect(element.html()).toBe('<span dir="ltr">1</span>'+$bidi.Format.RLE+'b');
    });

    it('should not add a correcting unicode embedding after wrapping when there is no more text', function() {
      element = $compile('<div dir="rtl">b{{a}}</div>')($rootScope);
      $rootScope.a = '1';
      $rootScope.$digest();
      expect(element.html()).toBe('b<span dir="ltr">1</span>');
    });

    it('should wrap multiple expressions', function() {
      element = $compile('<div dir="rtl">{{a}}b{{b}}</div>')($rootScope);
      $rootScope.a = '1';
      $rootScope.b = '2';
      $rootScope.$digest();
      expect(element.html()).toBe('<span dir="ltr">1</span>'+$bidi.Format.RLE+'b<span dir="ltr">2</span>');
    });

    it('should use the container dir property if the node only contains one expression', function() {
      element = $compile('<div dir> {{a}} </div>')($rootScope);
      $rootScope.a = RTL_TEXT;
      $rootScope.$digest();
      expect(element.prop('dir')).toBe('rtl');
      expect(element.html()).toBe(' '+RTL_TEXT+' ');
    });

    it('should use unicode embedding chars if the container is <title> or <option> or <textarea>', function() {
      $rootScope.b = 'b';

      element = $compile('<title dir="rtl">a{{b}}</title>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toBe('a'+$bidi.Format.LRE+'b'+$bidi.Format.PDF);

      element = $compile('<option dir="rtl">a{{b}}</option>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toBe('a'+$bidi.Format.LRE+'b'+$bidi.Format.PDF);

      element = $compile('<textarea dir="rtl">a{{b}}</textarea>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toBe('a'+$bidi.Format.LRE+'b'+$bidi.Format.PDF);
    });

    it('should use the nearest parent with a filled dir attribute', function() {
      element = $compile('<div dir="rtl"><div dir>a{{someVar}}</div>')($rootScope);
      $rootScope.someVar = LTR_TEXT;
      $rootScope.$digest();
      var childDiv = element.children();
      expect(childDiv.html()).toBe('a<span dir="ltr">'+LTR_TEXT+'</span>');

      $rootScope.someVar = RTL_TEXT;
      $rootScope.$digest();
      expect(childDiv.html()).toBe('a'+RTL_TEXT);
    });

    it('should assume ltr directionality if no parent element has a filled dir attribute', function() {
      element = $compile('<div dir>a{{someVar}}</div>')($rootScope);
      $rootScope.someVar = RTL_TEXT;
      $rootScope.$digest();
      expect(element.html()).toBe('a<span dir="rtl">'+RTL_TEXT+'</span>');

      $rootScope.someVar = LTR_TEXT;
      $rootScope.$digest();
      expect(element.html()).toBe('a'+LTR_TEXT);
    });

  });

  describe('attribute interpolation', function() {

    it('should not add unicode when the dir is the same for ltr text', function() {
      element = $compile('<div dir="ltr" title="{{someVar}}"></div>')($rootScope);
      $rootScope.someVar = LTR_TEXT ;
      $rootScope.$digest();
      expect(element.prop('title')).toBe(LTR_TEXT);
    });

    it('should not add unicode when the dir is the same for rtl text', function() {
      element = $compile('<div dir="rtl" title="{{someVar}}"></div>')($rootScope);
      $rootScope.someVar = RTL_TEXT ;
      $rootScope.$digest();
      expect(element.prop('title')).toBe(RTL_TEXT);
    });

    it('should wrap text with unicode embedding when dir differs for ltr text', function() {
      element = $compile('<div dir="rtl" title="{{someVar}}"></div>')($rootScope);
      $rootScope.someVar = LTR_TEXT ;
      $rootScope.$digest();
      expect(element.prop('title')).toBe($bidi.Format.LRE+LTR_TEXT+$bidi.Format.PDF);
    });

    it('should wrap text with unicode embedding when dir differs for rtl text', function() {
      element = $compile('<div dir="ltr" title="{{someVar}}"></div>')($rootScope);
      $rootScope.someVar = RTL_TEXT ;
      $rootScope.$digest();
      expect(element.prop('title')).toBe($bidi.Format.RLE+RTL_TEXT+$bidi.Format.PDF);
    });

    it('should not wrap rtl text outside of interpolation', function() {
      element = $compile('<div dir="ltr" title="{{someVar}}'+RTL_TEXT+'"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.prop('title')).toBe(RTL_TEXT);
    });

    it('should merge sibling expressions with the same directionality', function() {
      element = $compile('<div dir="rtl" title="{{a}}{{b}}"></div>')($rootScope);
      $rootScope.a = '1';
      $rootScope.b = '2';
      $rootScope.$digest();
      expect(element.prop('title')).toBe($bidi.Format.LRE+'12'+$bidi.Format.PDF);
    });

    it('should add a correcting unicode embedding after wrapping when there is more text', function() {
      element = $compile('<div dir="rtl" title="{{a}}b"></div>')($rootScope);
      $rootScope.a = '1';
      $rootScope.$digest();
      expect(element.prop('title')).toBe($bidi.Format.LRE+'1'+$bidi.Format.PDF+$bidi.Format.RLE+'b');
    });

    it('should not add a correcting unicode embedding after wrapping when there is no more text', function() {
      element = $compile('<div dir="rtl" title="{{a}}"></div>')($rootScope);
      $rootScope.a = '1';
      $rootScope.$digest();
      expect(element.prop('title')).toBe($bidi.Format.LRE+'1'+$bidi.Format.PDF);
    });

    it('should wrap multiple expressions', function() {
      element = $compile('<div dir="rtl" title="{{a}}b{{b}}"></div>')($rootScope);
      $rootScope.a = '1';
      $rootScope.b = '2';
      $rootScope.$digest();
      expect(element.prop('title')).toBe(
        $bidi.Format.LRE+'1'+$bidi.Format.PDF+
        $bidi.Format.RLE+'b'+
        $bidi.Format.LRE+'2'+$bidi.Format.PDF
      );
    });

    it('should node use unicode embedding if the attribute is ng-bind-template', function() {
      element = $compile('<div dir="rtl" ng-bind-template="{{someProp}}"></div>')($rootScope);
      $rootScope.someProp = 'a';
      $rootScope.$digest();
      expect(element.attr('ng-bind-template')).toBe('a');
    });
  });

});
