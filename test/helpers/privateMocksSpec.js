'use strict';

describe('private mocks', function() {
  describe('createMockStyleSheet', function() {

    it('should allow custom styles to be created and removed when the stylesheet is destroyed',
      inject(function($compile, $document, $window, $rootElement, $rootScope) {

      var doc = $document[0];
      var count = doc.styleSheets.length;
      var stylesheet = createMockStyleSheet($document, $window);
      var elm;
      runs(function() {
        expect(doc.styleSheets.length).toBe(count + 1);

        angular.element(doc.body).append($rootElement);

        elm = $compile('<div class="padded">...</div>')($rootScope);
        $rootElement.append(elm);

        expect(getStyle(elm, 'paddingTop')).toBe('0px');

        stylesheet.addRule('.padded', 'padding-top:2px');
      });

      waitsFor(function() {
        return getStyle(elm, 'paddingTop') === '2px';
      });

      runs(function() {
        stylesheet.destroy();

        expect(getStyle(elm, 'paddingTop')).toBe('0px');
      });

      function getStyle(element, key) {
        var node = element[0];
        return node.currentStyle ?
          node.currentStyle[key] :
          $window.getComputedStyle(node)[key];
      }
    }));

  });
});
