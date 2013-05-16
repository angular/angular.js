describe('Docs Syntax', function() {

  beforeEach(module('bootstrap'));

  describe('syntax', function() {

    var id, element, document;

    beforeEach(inject(function($compile, $rootScope, $document) {
      document = $document[0];
      //create the HTML elements missing in IE8 for this directive
      document.createElement('nav');

      element = angular.element(
        '<div>' +
          '<pre syntax ' +
            'syntax-github="gh-url" ' +
            'syntax-plunkr="pl-url" ' +
            'syntax-fiddle="jf-url">' +
          '</pre>' +
        '</div>'
      );
      $compile(element)($rootScope);
      $rootScope.$digest();

      element = element[0];
      document.body.appendChild(element);
    }));

    it("should properly prepare a github link in the page", function() {
      var github = element.querySelector('.syntax-github');
      expect(github.innerHTML).toMatch(/View on Github/i);
      expect(github.getAttribute('href')).toBe('gh-url');
    });

    it("should properly prepare a plunkr link in the page", function() {
      var plunkr = element.querySelector('.syntax-plunkr');
      expect(plunkr.innerHTML).toMatch(/View on Plunkr/i);
      expect(plunkr.getAttribute('href')).toBe('pl-url');
    });

    it("should properly prepare a jsfiddle link in the page", function() {
      var jsfiddle = element.querySelector('.syntax-jsfiddle');
      expect(jsfiddle.innerHTML).toMatch(/View on JSFiddle/i);
      expect(jsfiddle.getAttribute('href')).toBe('jf-url');
    });

  });

});
