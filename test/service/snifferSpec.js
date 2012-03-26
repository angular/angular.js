'use strict';

describe('$sniffer', function() {

  function sniffer($window) {
    return new $SnifferProvider().$get[1]($window);
  }

  describe('history', function() {
    it('should be true if history.pushState defined', function() {
      expect(sniffer({history: {pushState: noop, replaceState: noop}}).history).toBe(true);
    });

    it('should be false if history or pushState not defined', function() {
      expect(sniffer({history: {}}).history).toBe(false);
      expect(sniffer({}).history).toBe(false);
    });
  });

  describe('hashchange', function() {
    it('should be true if onhashchange property defined', function() {
      expect(sniffer({onhashchange: true, document: {}}).hashchange).toBe(true);
    });

    it('should be false if onhashchange property not defined', function() {
      expect(sniffer({document: {}}).hashchange).toBe(false);
    });

    it('should be false if documentMode is 7 (IE8 comp mode)', function() {
      expect(sniffer({onhashchange: true, document: {documentMode: 7}}).hashchange).toBe(false);
    });
  });
});
