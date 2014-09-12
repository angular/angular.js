ddescribe('svgAttrs', function() {
  var basePath;

  it('should load resources relative to app base url if attribute matches url(...)', inject(function ($rootScope, $compile, $httpBackend, $location, $document) {
    var urlAttrTest = /^url\(http\:\/\/[a-z]*\:[0-9]{3,5}\/resources\/[a-z\-]*\.svg\)/i,
        basePath = urlResolve('/resources').href,
        directives = [
          'clip-path',
          'color-profile',
          'src',
          'cursor',
          'fill',
          'filter',
          'marker',
          'marker-start',
          'marker-mid',
          'marker-end',
          'mask',
          'stroke'],
        template, element;

    template = [
      '<svg>',
        '<ellipse ',
          'clip-path="url(/resources/clip-path.svg)" ',
          'color-profile="url(/resources/color-profile.svg)" ',
          'src="url(/resources/src.svg)" ',
          'cursor="url(/resources/cursor.svg)" ',
          'fill="url(/resources/fill.svg)" ',
          'filter="url(/resources/filter.svg)" ',
          'marker="url(/resources/marker.svg)" ',
          'marker-start="url(/resources/marker-start.svg)" ',
          'marker-mid="url(/resources/marker-mid.svg)" ',
          'marker-end="url(/resources/marker-end.svg)" ',
          'mask="url(/resources/mask.svg)" ',
          'stroke="url(/resources/stroke.svg)">',
        '</ellipse>',
      '</svg>'].join('')
    element = $compile(template)($rootScope);
    $rootScope.$digest();

    forEach(directives, function(attr) {
      expect(element.children(0).attr(attr)).toMatch(urlAttrTest);
      expect(element.children(0).attr(attr)).toContain(attr + '.svg');
    });
  }));


  it('should do nothing if no url()', inject(function($compile, $rootScope) {
    var element = $compile('<svg><ellipse clip-path="someNonUrl"></ellipse></svg>')($rootScope);
    expect(element.children(0).attr('clip-path')).toBe('someNonUrl');
  }));


  it('should only apply to svg elements', inject(function($rootScope, $compile) {
    var basePath = urlResolve('/resources').href;
    template = '<div><span clip-path="url(foo)"></span></div>';
    element = $compile(template)($rootScope);
    $rootScope.$digest();
    expect(element.html()).toContain('url(foo)');
    expect(element.html()).not.toContain(basePath);
  }));


  it('should make hash relative to current path in html5mode', function() {
    //This test uses $location's fake base: http://server, since urlResolve is not being used
    module(function($locationProvider, $provide) {
      $locationProvider.html5Mode(true);
    });

    inject(function($compile, $rootScope, $location, $browser) {
      var element;
      $location.path('/mypath');
      var template = [
        '<svg>',
          '<ellipse clip-path="url(#my-clip)"></ellipse>',
        '</svg>'
      ].join('');
      element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect(element.children(0).attr('clip-path')).toBe('url(http://server/mypath#my-clip)');
    });
  });


  it('should make hash relative to appBase when not in html5mode', function() {
    inject(function($compile, $rootScope, $location, $browser) {
      var element;
      $location.path('/mypath');
      var template = [
        '<svg>',
          '<ellipse clip-path="url(#my-clip)"></ellipse>',
        '</svg>'
      ].join('');
      element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect(element.children(0).attr('clip-path')).toBe('url(http://server/#my-clip)');
    });
  });


  it('should update url on $locationChangeSuccess event in html5mode', function() {
    //This test uses $location's fake base: http://server, since urlResolve is not being used
    module(function($locationProvider, $provide) {
      $locationProvider.html5Mode(true);
    });

    inject(function($compile, $rootScope, $location, $browser) {
      var element;

      var template = [
        '<svg>',
          '<ellipse clip-path="url(#my-clip)"></ellipse>',
        '</svg>'
      ].join('');
      element = $compile(template)($rootScope);
      $location.path('/mypath');
      $rootScope.$digest();
      expect(element.children(0).attr('clip-path')).toBe('url(http://server/mypath#my-clip)');
      $location.path('/newpath');
      $rootScope.$digest();
      expect(element.children(0).attr('clip-path')).toBe('url(http://server/newpath#my-clip)');

    });
  });


  it('should NOT update url on $locationChangeSuccess event when not in html5mode', function() {
    //browser just cares about appBase in non-html5 mode
    module(function($locationProvider, $provide) {
      $locationProvider.html5Mode(false);
    });

    inject(function($compile, $rootScope, $location, $browser) {
      var element;

      var template = [
        '<svg>',
          '<ellipse clip-path="url(#my-clip)"></ellipse>',
        '</svg>'
      ].join('');
      element = $compile(template)($rootScope);
      $location.path('/mypath');
      $rootScope.$digest();
      expect(element.children(0).attr('clip-path')).toBe('url(http://server/#my-clip)');
      $location.path('/newpath');
      $rootScope.$digest();
      expect(element.children(0).attr('clip-path')).toBe('url(http://server/#my-clip)');
    });
  });


  it('should support expressions', function() {

  });


  it('should do nothing with urls of different origins');
});
