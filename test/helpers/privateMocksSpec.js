'use strict';

describe('private mocks', function() {

  describe('Jasmine extensions', function() {

    describe('they', function() {
      it('should call `it` for each item in an array', function() {
        spyOn(window, 'it');

        they('should do stuff with $prop', ['a', 'b', 'c']);
        expect(window.it.calls.length).toEqual(3);
        expect(window.it).toHaveBeenCalledWith('should do stuff with "a"', jasmine.any(Function));
        expect(window.it).toHaveBeenCalledWith('should do stuff with "b"', jasmine.any(Function));
        expect(window.it).toHaveBeenCalledWith('should do stuff with "c"', jasmine.any(Function));
      });

      it('should replace multiple occurrences of `$prop`', function() {
        spyOn(window, 'it');

        they('should fight $prop with $prop', ['fire']);
        expect(window.it).toHaveBeenCalledWith('should fight "fire" with "fire"', jasmine.any(Function));
      });

      it('should pass each item in an array to the handler', function() {
        var handlerSpy = jasmine.createSpy('handler');
        spyOn(window, 'it').andCallFake(function(msg, handler) {
          handler();
        });
        they('should do stuff with $prop', ['a', 'b', 'c'], handlerSpy);
        expect(handlerSpy).toHaveBeenCalledWith('a');
        expect(handlerSpy).toHaveBeenCalledWith('b');
        expect(handlerSpy).toHaveBeenCalledWith('c');
      });


      it('should call `it` for each key-value pair an object', function() {
        spyOn(window, 'it');

        they('should do stuff with $prop', {a: 1, b:2, c:3});
        expect(window.it.calls.length).toEqual(3);
        expect(window.it).toHaveBeenCalledWith('should do stuff with "a"', jasmine.any(Function));
        expect(window.it).toHaveBeenCalledWith('should do stuff with "b"', jasmine.any(Function));
        expect(window.it).toHaveBeenCalledWith('should do stuff with "c"', jasmine.any(Function));
      });


      it('should pass each key-value pair in an object to the handler', function() {
        var handlerSpy = jasmine.createSpy('handler');
        spyOn(window, 'it').andCallFake(function(msg, handler) {
          handler();
        });
        they('should do stuff with $prop', {a: 1, b:2, c:3}, handlerSpy);
        expect(handlerSpy).toHaveBeenCalledWith(1);
        expect(handlerSpy).toHaveBeenCalledWith(2);
        expect(handlerSpy).toHaveBeenCalledWith(3);
      });


      it('should call handler with correct `this`', function() {
        var handlerSpy = jasmine.createSpy('handler');
        var dummyThis = { name: 'dummyThis' };

        spyOn(window, 'it').andCallFake(function(msg, handler) {
          handler.call(dummyThis);
        });

        they('should do stuff with $prop', ['a'], handlerSpy);
        expect(window.it).toHaveBeenCalledWith('should do stuff with "a"', jasmine.any(Function));
        expect(handlerSpy.mostRecentCall.object).toBe(dummyThis);
      });
    });


    describe('tthey', function() {
      it('should call `iit` for each item in an array', function() {
        spyOn(window, 'iit');

        tthey('should do stuff with $prop', ['a', 'b', 'c']);
        expect(window.iit.calls.length).toEqual(3);
        expect(window.iit).toHaveBeenCalledWith('should do stuff with "a"', jasmine.any(Function));
        expect(window.iit).toHaveBeenCalledWith('should do stuff with "b"', jasmine.any(Function));
        expect(window.iit).toHaveBeenCalledWith('should do stuff with "c"', jasmine.any(Function));
      });


      it('should pass each item in an array to the handler', function() {
        var handlerSpy = jasmine.createSpy('handler');
        spyOn(window, 'iit').andCallFake(function(msg, handler) {
          handler();
        });
        tthey('should do stuff with $prop', ['a', 'b', 'c'], handlerSpy);
        expect(handlerSpy).toHaveBeenCalledWith('a');
        expect(handlerSpy).toHaveBeenCalledWith('b');
        expect(handlerSpy).toHaveBeenCalledWith('c');
      });


      it('should call `it` for each key-value pair an object', function() {
        spyOn(window, 'iit');

        tthey('should do stuff with $prop', {a: 1, b:2, c:3});
        expect(window.iit.calls.length).toEqual(3);
        expect(window.iit).toHaveBeenCalledWith('should do stuff with "a"', jasmine.any(Function));
        expect(window.iit).toHaveBeenCalledWith('should do stuff with "b"', jasmine.any(Function));
        expect(window.iit).toHaveBeenCalledWith('should do stuff with "c"', jasmine.any(Function));
      });


      it('should pass each key-value pair in an object to the handler', function() {
        var handlerSpy = jasmine.createSpy('handler');
        spyOn(window, 'iit').andCallFake(function(msg, handler) {
          handler();
        });
        tthey('should do stuff with $prop', {a: 1, b:2, c:3}, handlerSpy);
        expect(handlerSpy).toHaveBeenCalledWith(1);
        expect(handlerSpy).toHaveBeenCalledWith(2);
        expect(handlerSpy).toHaveBeenCalledWith(3);
      });


      it('should call handler with correct `this`', function() {
        var handlerSpy = jasmine.createSpy('handler');
        var dummyThis = { name: 'dummyThis' };

        spyOn(window, 'iit').andCallFake(function(msg, handler) {
          handler.call(dummyThis);
        });

        tthey('should do stuff with $prop', ['a'], handlerSpy);
        expect(window.iit).toHaveBeenCalledWith('should do stuff with "a"', jasmine.any(Function));
        expect(handlerSpy.mostRecentCall.object).toBe(dummyThis);
      });
    });


    describe('xthey', function() {
      it('should call `xit` for each item in an array', function() {
        spyOn(window, 'xit');

        xthey('should do stuff with $prop', ['a', 'b', 'c']);
        expect(window.xit.calls.length).toEqual(3);
        expect(window.xit).toHaveBeenCalledWith('should do stuff with "a"', jasmine.any(Function));
        expect(window.xit).toHaveBeenCalledWith('should do stuff with "b"', jasmine.any(Function));
        expect(window.xit).toHaveBeenCalledWith('should do stuff with "c"', jasmine.any(Function));
      });


      it('should pass each item in an array to the handler', function() {
        var handlerSpy = jasmine.createSpy('handler');
        spyOn(window, 'xit').andCallFake(function(msg, handler) {
          handler();
        });
        xthey('should do stuff with $prop', ['a', 'b', 'c'], handlerSpy);
        expect(handlerSpy).toHaveBeenCalledWith('a');
        expect(handlerSpy).toHaveBeenCalledWith('b');
        expect(handlerSpy).toHaveBeenCalledWith('c');
      });


      it('should call `it` for each key-value pair an object', function() {
        spyOn(window, 'xit');

        xthey('should do stuff with $prop', {a: 1, b:2, c:3});
        expect(window.xit.calls.length).toEqual(3);
        expect(window.xit).toHaveBeenCalledWith('should do stuff with "a"', jasmine.any(Function));
        expect(window.xit).toHaveBeenCalledWith('should do stuff with "b"', jasmine.any(Function));
        expect(window.xit).toHaveBeenCalledWith('should do stuff with "c"', jasmine.any(Function));
      });


      it('should pass each key-value pair in an object to the handler', function() {
        var handlerSpy = jasmine.createSpy('handler');
        spyOn(window, 'xit').andCallFake(function(msg, handler) {
          handler();
        });
        xthey('should do stuff with $prop', {a: 1, b:2, c:3}, handlerSpy);
        expect(handlerSpy).toHaveBeenCalledWith(1);
        expect(handlerSpy).toHaveBeenCalledWith(2);
        expect(handlerSpy).toHaveBeenCalledWith(3);
      });


      it('should call handler with correct `this`', function() {
        var handlerSpy = jasmine.createSpy('handler');
        var dummyThis = { name: 'dummyThis' };

        spyOn(window, 'xit').andCallFake(function(msg, handler) {
          handler.call(dummyThis);
        });

        xthey('should do stuff with $prop', ['a'], handlerSpy);
        expect(window.xit).toHaveBeenCalledWith('should do stuff with "a"', jasmine.any(Function));
        expect(handlerSpy.mostRecentCall.object).toBe(dummyThis);
      });
    });
  });


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
