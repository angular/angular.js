'use strict';

describe('scriptDirective', function() {
  var element;


  afterEach(function(){
    dealoc(element);
  });


  it('should populate $templateCache with contents of a ng-template script element', inject(
      function($compile, $templateCache) {
        if (msie <=8) return;
        // in ie8 it is not possible to create a script tag with the right content.
        // it always comes up as empty. I was trying to set the text of the
        // script tag, but that did not work either, so I gave up.
        $compile('<div>foo' +
                   '<script id="/ignore">ignore me</script>' +
                   '<script type="text/ng-template" id="/myTemplate.html"><x>{{y}}</x></script>' +
                 '</div>' );
        expect($templateCache.get('/myTemplate.html')).toBe('<x>{{y}}</x>');
        expect($templateCache.get('/ignore')).toBeUndefined();
      }
  ));


  it('should not compile scripts', inject(function($compile, $templateCache, $rootScope) {
    if (msie <=8) return; // see above

    var doc = jqLite('<div></div>');
    // jQuery is too smart and removes
    doc[0].innerHTML = '<script type="text/javascript">some {{binding}}</script>' +
                       '<script type="text/ng-template" id="/some">other {{binding}}</script>';

    $compile(doc)($rootScope);
    $rootScope.$digest();

    var scripts = doc.find('script');
    expect(scripts.eq(0).text()).toBe('some {{binding}}');
    expect(scripts.eq(1).text()).toBe('other {{binding}}');
    dealoc(doc);
  }));
});
