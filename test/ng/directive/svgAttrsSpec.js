ddescribe('svgAttrs', function() {
  var basePath;

  beforeEach(function() {
    module(function($locationProvider) {

    });
  });

  afterEach(inject(function() {

  }));


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

    dump(urlResolve('#foo'));
  }));


  it('should work with hashes')
  it('should do nothing if no url()')
  it('should support expressions with allOrNothing');
  it('should only apply to svg elements');
});
