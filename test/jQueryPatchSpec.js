'use strict';

if (window.jQuery) {

  describe('jQuery patch', function() {

    var doc = null;
    var divSpy = null;
    var spy1 = null;
    var spy2 = null;

    beforeEach(function() {
      divSpy = jasmine.createSpy('div.$destroy');
      spy1 = jasmine.createSpy('span1.$destroy');
      spy2 = jasmine.createSpy('span2.$destroy');
      doc = $('<div><span class=first>abc</span><span class=second>xyz</span></div>');
      doc.find('span.first').on('$destroy', spy1);
      doc.find('span.second').on('$destroy', spy2);
    });

    afterEach(function() {
      expect(divSpy).not.toHaveBeenCalled();

      expect(spy1).toHaveBeenCalled();
      expect(spy1.callCount).toEqual(1);
      expect(spy2).toHaveBeenCalled();
      expect(spy2.callCount).toEqual(1);
    });

    describe('$detach event', function() {

      it('should fire on detach()', function() {
        doc.find('span').detach();
      });

      it('should fire on remove()', function() {
        doc.find('span').remove();
      });

      it('should fire on replaceWith()', function() {
        doc.find('span').replaceWith('<b>bla</b>');
      });

      it('should fire on replaceAll()', function() {
        $('<b>bla</b>').replaceAll(doc.find('span'));
      });

      it('should fire on empty()', function() {
        doc.empty();
      });

      it('should fire on html(param)', function() {
        doc.html('abc');
      });

      it('should fire on html(\'\')', function() {
        doc.html('');
      });
    });
  });

  describe('jQuery patch eagerness', function() {

    var doc = null;
    var divSpy = null;
    var spy1 = null;
    var spy2 = null;

    beforeEach(function() {
      divSpy = jasmine.createSpy('div.$destroy');
      spy1 = jasmine.createSpy('span1.$destroy');
      spy2 = jasmine.createSpy('span2.$destroy');
      doc = $('<div><span class=first>abc</span><span class=second>xyz</span></div>');
      doc.find('span.first').bind('$destroy', spy1);
      doc.find('span.second').bind('$destroy', spy2);
    });

    afterEach(function() {
      expect(divSpy).not.toHaveBeenCalled();
      expect(spy1).not.toHaveBeenCalled();
    });

    describe('$detach event is not invoked in too many cases', function() {

      it('should fire only on matched elements on detach(selector)', function() {
        doc.find('span').detach('.second');
        expect(spy2).toHaveBeenCalled();
        expect(spy2.callCount).toEqual(1);
      });

      it('should fire only on matched elements on remove(selector)', function() {
        doc.find('span').remove('.second');
        expect(spy2).toHaveBeenCalled();
        expect(spy2.callCount).toEqual(1);
      });

      it('should not fire on html()', function() {
        doc.html();
        expect(spy2).not.toHaveBeenCalled();
      });
    });
  });
}
