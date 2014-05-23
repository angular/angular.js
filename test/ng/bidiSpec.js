'use strict';

describe('$bidi', function() {

  describe('directionForText', function() {

    // Test cases are copied from
    // https://github.com/google/closure-library/blob/master/closure/goog/i18n/bidi_test.js
    it('should return the correct values', inject(function($bidi) {
      expect(
        $bidi.estimateDirection('', false)).toEqual($bidi.Dir.NEUTRAL);
      expect(
        $bidi.estimateDirection(' ', false)).toEqual($bidi.Dir.NEUTRAL);
      expect(
        $bidi.estimateDirection('! (...)).toEqual($bidi.Dir.NEUTRAL', false));
      expect(
        $bidi.estimateDirection('All-Ascii content', false)).toEqual($bidi.Dir.LTR);
      expect(
        $bidi.estimateDirection('-17.0%', false)).toEqual($bidi.Dir.LTR);
      expect(
        $bidi.estimateDirection('http://foo/bar/', false)).toEqual($bidi.Dir.LTR);
      expect(
        $bidi.estimateDirection(
          'http://foo/bar/?s=\u05d0\u05d0\u05d0\u05d0\u05d0\u05d0' +
            '\u05d0\u05d0\u05d0\u05d0\u05d0\u05d0\u05d0\u05d0\u05d0' +
            '\u05d0\u05d0\u05d0\u05d0\u05d0\u05d0\u05d0\u05d0\u05d0',
          false)).toEqual($bidi.Dir.LTR);
      expect(
        $bidi.estimateDirection('\u05d0', false)).toEqual($bidi.Dir.RTL);
      expect(
        $bidi.estimateDirection(
          '9 \u05d0 -> 17.5, 23, 45, 19', false)).toEqual($bidi.Dir.RTL);
      expect(
        $bidi.estimateDirection(
          'http://foo/bar/ \u05d0 http://foo2/bar2/ ' +
            'http://foo3/bar3/', false)).toEqual($bidi.Dir.RTL);
      expect(
        $bidi.estimateDirection(
          '\u05d0\u05d9\u05df \u05de\u05de\u05e9 ' +
            '\u05de\u05d4 \u05dc\u05e8\u05d0\u05d5\u05ea: ' +
            '\u05dc\u05d0 \u05e6\u05d9\u05dc\u05de\u05ea\u05d9 ' +
            '\u05d4\u05e8\u05d1\u05d4 \u05d5\u05d2\u05dd \u05d0' +
            '\u05dd \u05d4\u05d9\u05d9\u05ea\u05d9 \u05de\u05e6' +
            '\u05dc\u05dd, \u05d4\u05d9\u05d4 \u05e9\u05dd', false)).toEqual($bidi.Dir.RTL);
      expect(
        $bidi.estimateDirection(
          '\u05db\u05d0 - http://geek.co.il/gallery/v/2007-06' +
            ' - \u05d0\u05d9\u05df \u05de\u05de\u05e9 \u05de\u05d4 ' +
            '\u05dc\u05e8\u05d0\u05d5\u05ea: \u05dc\u05d0 \u05e6' +
            '\u05d9\u05dc\u05de\u05ea\u05d9 \u05d4\u05e8\u05d1 ' +
            '\u05d5\u05d2\u05dd \u05d0\u05dd \u05d4\u05d9\u05d9' +
            '\u05d9 \u05de\u05e6\u05dc\u05dd, \u05d4\u05d9\u05d4 ' +
            '\u05e9\u05dd \u05d1\u05e2\u05d9\u05e7 \u05d4\u05e8' +
            '\u05d1\u05d4 \u05d0\u05e0\u05e9\u05d9\u05dd. \u05de' +
            '\u05d4 \u05e9\u05db\u05df - \u05d0\u05e4\u05e9\u05e8 ' +
            '\u05dc\u05e0\u05e6\u05dc \u05d0\u05ea \u05d4\u05d4 ' +
            '\u05d3\u05d6\u05de\u05e0\u05d5 \u05dc\u05d4\u05e1' +
            '\u05ea\u05db\u05dc \u05e2\u05dc \u05db\u05de\u05d4 ' +
            '\u05ea\u05de\u05d5\u05e0\u05d5\u05ea \u05de\u05e9' +
            '\u05e9\u05e2\u05d5\u05ea \u05d9\u05e9\u05e0\u05d5 ' +
            '\u05d9\u05d5\u05ea\u05e8 \u05e9\u05d9\u05e9 \u05dc' +
            '\u05d9 \u05d1\u05d0\u05ea\u05e8', false)).toEqual($bidi.Dir.RTL);
      expect(
        $bidi.estimateDirection(
          'CAPTCHA \u05de\u05e9\u05d5\u05db\u05dc\u05dc ' +
            '\u05de\u05d3\u05d9?', false)).toEqual($bidi.Dir.RTL);
      expect(
        $bidi.estimateDirection(
          'Yes Prime Minister \u05e2\u05d3\u05db\u05d5\u05df. ' +
            '\u05e9\u05d0\u05dc\u05d5 \u05d0\u05d5\u05ea\u05d9 ' +
            '\u05de\u05d4 \u05d0\u05e0\u05d9 \u05e8\u05d5\u05e6' +
            '\u05d4 \u05de\u05ea\u05e0\u05d4 \u05dc\u05d7\u05d2',
          false)).toEqual($bidi.Dir.RTL);
      expect(
        $bidi.estimateDirection(
          '17.4.02 \u05e9\u05e2\u05d4:13-20 .15-00 .\u05dc\u05d0 ' +
            '\u05d4\u05d9\u05d9\u05ea\u05d9 \u05db\u05d0\u05df.',
          false)).toEqual($bidi.Dir.RTL);
      expect(
        $bidi.estimateDirection(
          '5710 5720 5730. \u05d4\u05d3\u05dc\u05ea. ' +
            '\u05d4\u05e0\u05e9\u05d9\u05e7\u05d4', false)).toEqual($bidi.Dir.RTL);
      expect(
        $bidi.estimateDirection(
          '\u05d4\u05d3\u05dc\u05ea http://www.google.com ' +
            'http://www.gmail.com', false)).toEqual($bidi.Dir.RTL);
      expect(
        $bidi.estimateDirection(
          '\u200f\u202eArtielish\u202c\u200f')).toEqual($bidi.Dir.RTL);
      expect(
        $bidi.estimateDirection(
          '\u05d4\u05d3\u05dc <some quite nasty html mark up>',
          false)).toEqual($bidi.Dir.LTR);
      expect(
        $bidi.estimateDirection(
          '\u05d4\u05d3\u05dc <some quite nasty html mark up>',
          true)).toEqual($bidi.Dir.RTL);
      expect(
        $bidi.estimateDirection(
          '\u05d4\u05d3\u05dc\u05ea &amp; &lt; &gt;', false)).toEqual($bidi.Dir.LTR);
      expect(
        $bidi.estimateDirection(
          '\u05d4\u05d3\u05dc\u05ea &amp; &lt; &gt;', true)).toEqual($bidi.Dir.RTL);
      expect(
        $bidi.estimateDirection(
          'foo/<b>\u05d0</b>', true)).toEqual($bidi.Dir.LTR);
    }));

  });

  describe('localeDir', function() {

    // Test cases are copied from
    // https://closure-library.googlecode.com/git/closure/goog/i18n/bidi_test.js
    test('en', false);
    test('fr', false);
    test('zh-CN', false);
    test('fil', false);
    test('az', false);
    test('iw-Latn', false);
    test('iw-LATN', false);
    test('iw_latn', false);
    test('ar', true);
    test('AR', true);
    test('iw', true);
    test('he', true);
    test('fa', true);
    test('ar-EG', true);
    test('az-Arab', true);
    test('az-ARAB-IR', true);
    test('az_arab_IR', true);

    function test(localeId, isRtl) {
      it('should detect the direction for locale '+localeId+' correctly', function() {
        module(function($provide) {
          $provide.value('$locale', {id: localeId});
        });
        inject(function($bidi) {
          var expectedDir = isRtl ? $bidi.Dir.RTL : $bidi.Dir.LTR;
          expect($bidi.localeDir()).toBe(expectedDir);
        });
      });
    }
  });

});
