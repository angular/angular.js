describe("errorLinkFilter", function () {

  var errorLinkFilter;

  beforeEach(module('docsApp'));

  beforeEach(inject(function ($filter) {
    errorLinkFilter = $filter('errorLink');
  }));

  it('should not change text that does not contain links', function () {
    expect(errorLinkFilter('This is a test')).toBe('This is a test');
  });

  it('should find links in text and linkify them', function () {
    var output = errorLinkFilter("http://ab/ (http://a/) http://1.2/v:~-123. c");
    //temporary fix for IE8 sanitization whitespace bug
    output = output.replace('</a>(','</a> (');
    expect(output).
      toBe('<a href="http://ab/">http://ab/</a> ' +
              '(<a href="http://a/">http://a/</a>) ' +
              '<a href="http://1.2/v:~-123">http://1.2/v:~-123</a>. c');
    expect(errorLinkFilter(undefined)).not.toBeDefined();
  });

  it('should handle mailto', function () {
    expect(errorLinkFilter("mailto:me@example.com")).
      toBe('<a href="mailto:me@example.com">me@example.com</a>');
    expect(errorLinkFilter("me@example.com")).
      toBe('<a href="mailto:me@example.com">me@example.com</a>');
    expect(errorLinkFilter("send email to me@example.com, but")).
      toBe('send email to <a href="mailto:me@example.com">me@example.com</a>, but');
  });

  it('should handle target', function () {
    expect(errorLinkFilter("http://example.com", "_blank")).
      toBe('<a target="_blank" href="http://example.com">http://example.com</a>')
    expect(errorLinkFilter("http://example.com", "someNamedIFrame")).
      toBe('<a target="someNamedIFrame" href="http://example.com">http://example.com</a>')
  });

  it('should not linkify stack trace URLs', function () {
    expect(errorLinkFilter("http://example.com/angular.min.js:42:1337")).
      toBe("http://example.com/angular.min.js:42:1337");
  });

  it('should truncate linked URLs at 60 characters', function () {
    expect(errorLinkFilter("http://errors.angularjs.org/very-long-version-string/$injector/nomod?p0=myApp")).
      toBe('<a href="http://errors.angularjs.org/very-long-version-string/$injector/nomod?p0=myApp">' +
        'http://errors.angularjs.org/very-long-version-string/$inj...</a>');
  });
});
