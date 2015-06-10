'use strict';

describe('linky', function() {
  var linky;

  beforeEach(module('ngSanitize'));

  beforeEach(inject(function($filter) {
    linky = $filter('linky');
  }));

  it('should do basic filter', function() {
    expect(linky("http://ab/ (http://a/) <http://a/> http://1.2/v:~-123. c “http://example.com” ‘http://me.com’")).
      toEqual('<a href="http://ab/">http://ab/</a> ' +
              '(<a href="http://a/">http://a/</a>) ' +
              '&lt;<a href="http://a/">http://a/</a>&gt; ' +
              '<a href="http://1.2/v:~-123">http://1.2/v:~-123</a>. c ' +
              '&#8220;<a href="http://example.com">http://example.com</a>&#8221; ' +
              '&#8216;<a href="http://me.com">http://me.com</a>&#8217;');
    expect(linky(undefined)).not.toBeDefined();
  });

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
    expect(linky("mailto:me@example.com")).
                    toEqual('<a href="mailto:me@example.com">me@example.com</a>');
    expect(linky("me@example.com")).
                    toEqual('<a href="mailto:me@example.com">me@example.com</a>');
    expect(linky("send email to me@example.com, but")).
      toEqual('send email to <a href="mailto:me@example.com">me@example.com</a>, but');
    expect(linky("my email is \"me@example.com\"")).
      toEqual('my email is &#34;<a href="mailto:me@example.com">me@example.com</a>&#34;');
  });

  it('should handle quotes in the email', function() {
    expect(linky('foo@"bar".com')).toEqual('<a href="mailto:foo@&#34;bar&#34;.com">foo@&#34;bar&#34;.com</a>');
  });

  it('should handle target:', function() {
    expect(linky("http://example.com", "_blank")).
      toEqual('<a target="_blank" href="http://example.com">http://example.com</a>');
    expect(linky("http://example.com", "someNamedIFrame")).
      toEqual('<a target="someNamedIFrame" href="http://example.com">http://example.com</a>');
  });
});
