'use strict';

describe('linky', function() {
  var linky;

  beforeEach(module('ngSanitize'));

  beforeEach(inject(function($filter){
    linky = $filter('linky');
  }));

  it('should do basic filter', function() {
    expect(linky("http://ab/ (http://a/) <http://a/> http://1.2/v:~-123. c")).
      toEqual('<a href="http://ab/">http://ab/</a> ' +
              '(<a href="http://a/">http://a/</a>) ' +
              '&lt;<a href="http://a/">http://a/</a>&gt; ' +
              '<a href="http://1.2/v:~-123">http://1.2/v:~-123</a>. c');
    expect(linky(undefined)).not.toBeDefined();
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

  it('should handle target:', function() {
    expect(linky("http://example.com", "_blank")).
      toEqual('<a target="_blank" href="http://example.com">http://example.com</a>');
    expect(linky("http://example.com", "someNamedIFrame")).
      toEqual('<a target="someNamedIFrame" href="http://example.com">http://example.com</a>');
  });
});
