'use strict';

describe('linky', function() {
  var linky;

  beforeEach(module('ngSanitize'));

  beforeEach(inject(function($filter) {
    linky = $filter('linky');
  }));

  it('should do basic filter', function() {
    expect(linky('http://ab/ (http://a/) <http://a/> http://1.2/v:~-123. c “http://example.com” ‘http://me.com’')).
      toEqual('<a href="http://ab/">http://ab/</a> ' +
              '(<a href="http://a/">http://a/</a>) ' +
              '&lt;<a href="http://a/">http://a/</a>&gt; ' +
              '<a href="http://1.2/v:~-123">http://1.2/v:~-123</a>. c ' +
              '&#8220;<a href="http://example.com">http://example.com</a>&#8221; ' +
              '&#8216;<a href="http://me.com">http://me.com</a>&#8217;');
    expect(linky(undefined)).not.toBeDefined();
  });

  it('should return `undefined`/`null`/`""` values unchanged', function() {
    expect(linky(undefined)).toBeUndefined();
    expect(linky(null)).toBe(null);
    expect(linky('')).toBe('');
  });

  it('should throw an error when used with a non-string value (other than `undefined`/`null`)',
    function() {
      expect(function() { linky(false); }).
        toThrowMinErr('linky', 'notstring', 'Expected string but received: false');

      expect(function() { linky(true); }).
        toThrowMinErr('linky', 'notstring', 'Expected string but received: true');

      expect(function() { linky(0); }).
        toThrowMinErr('linky', 'notstring', 'Expected string but received: 0');

      expect(function() { linky(42); }).
        toThrowMinErr('linky', 'notstring', 'Expected string but received: 42');

      expect(function() { linky({}); }).
        toThrowMinErr('linky', 'notstring', 'Expected string but received: {}');

      expect(function() { linky([]); }).
        toThrowMinErr('linky', 'notstring', 'Expected string but received: []');

      expect(function() { linky(noop); }).
        toThrowMinErr('linky', 'notstring', 'Expected string but received: function noop()');
    }
  );

  it('should be case-insensitive', function() {
    expect(linky('WWW.example.com')).toEqual('<a href="http://WWW.example.com">WWW.example.com</a>');
    expect(linky('WWW.EXAMPLE.COM')).toEqual('<a href="http://WWW.EXAMPLE.COM">WWW.EXAMPLE.COM</a>');
    expect(linky('HTTP://www.example.com')).toEqual('<a href="HTTP://www.example.com">HTTP://www.example.com</a>');
    expect(linky('HTTP://example.com')).toEqual('<a href="HTTP://example.com">HTTP://example.com</a>');
    expect(linky('HTTPS://www.example.com')).toEqual('<a href="HTTPS://www.example.com">HTTPS://www.example.com</a>');
    expect(linky('HTTPS://example.com')).toEqual('<a href="HTTPS://example.com">HTTPS://example.com</a>');
  });

  it('should handle www.', function() {
    expect(linky('www.example.com')).toEqual('<a href="http://www.example.com">www.example.com</a>');
  });

  it('should handle mailto:', function() {
    expect(linky('mailto:me@example.com')).
                    toEqual('<a href="mailto:me@example.com">me@example.com</a>');
    expect(linky('me@example.com')).
                    toEqual('<a href="mailto:me@example.com">me@example.com</a>');
    expect(linky('send email to me@example.com, but')).
      toEqual('send email to <a href="mailto:me@example.com">me@example.com</a>, but');
    expect(linky('my email is "me@example.com"')).
      toEqual('my email is &#34;<a href="mailto:me@example.com">me@example.com</a>&#34;');
  });

  it('should handle quotes in the email', function() {
    expect(linky('foo@"bar".com')).toEqual('<a href="mailto:foo@&#34;bar&#34;.com">foo@&#34;bar&#34;.com</a>');
  });

  it('should handle target:', function() {
    expect(linky('http://example.com', '_blank')).
      toBeOneOf('<a target="_blank" href="http://example.com">http://example.com</a>',
                '<a href="http://example.com" target="_blank">http://example.com</a>');
    expect(linky('http://example.com', 'someNamedIFrame')).
      toBeOneOf('<a target="someNamedIFrame" href="http://example.com">http://example.com</a>',
                '<a href="http://example.com" target="someNamedIFrame">http://example.com</a>');
  });

  describe('custom attributes', function() {

    it('should optionally add custom attributes', function() {
      expect(linky('http://example.com', '_self', {rel: 'nofollow'})).
        toBeOneOf('<a rel="nofollow" target="_self" href="http://example.com">http://example.com</a>',
                  '<a href="http://example.com" target="_self" rel="nofollow">http://example.com</a>');
    });


    it('should override target parameter with custom attributes', function() {
      expect(linky('http://example.com', '_self', {target: '_blank'})).
        toBeOneOf('<a target="_blank" href="http://example.com">http://example.com</a>',
                  '<a href="http://example.com" target="_blank">http://example.com</a>');
    });


    it('should optionally add custom attributes from function', function() {
      expect(linky('http://example.com', '_self', function(url) {return {'class': 'blue'};})).
        toBeOneOf('<a class="blue" target="_self" href="http://example.com">http://example.com</a>',
                  '<a href="http://example.com" target="_self" class="blue">http://example.com</a>',
                  '<a class="blue" href="http://example.com" target="_self">http://example.com</a>');
    });


    it('should pass url as parameter to custom attribute function', function() {
      var linkParameters = jasmine.createSpy('linkParameters').and.returnValue({'class': 'blue'});
      linky('http://example.com', '_self', linkParameters);
      expect(linkParameters).toHaveBeenCalledWith('http://example.com');
    });


    it('should call the attribute function for all links in the input', function() {
      var attributeFn = jasmine.createSpy('attributeFn').and.returnValue({});
      linky('http://example.com and http://google.com', '_self', attributeFn);
      expect(attributeFn.calls.allArgs()).toEqual([['http://example.com'], ['http://google.com']]);
    });


    it('should strip unsafe attributes', function() {
      expect(linky('http://example.com', '_self', {'class': 'blue', 'onclick': 'alert(\'Hi\')'})).
        toBeOneOf('<a class="blue" target="_self" href="http://example.com">http://example.com</a>',
                  '<a href="http://example.com" target="_self" class="blue">http://example.com</a>',
                  '<a class="blue" href="http://example.com" target="_self">http://example.com</a>');
    });
  });
});
