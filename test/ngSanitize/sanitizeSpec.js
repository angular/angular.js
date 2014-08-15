'use strict';

describe('HTML', function() {

  var expectHTML;

  beforeEach(module('ngSanitize'));
  beforeEach(function() {
    expectHTML = function(html){
      var sanitize;
      inject(function($sanitize) {
        sanitize = $sanitize;
      });
      return expect(sanitize(html));
    };
  });

  describe('htmlParser', function() {
    /* global htmlParser */
    if (angular.isUndefined(window.htmlParser)) return;

    var handler, start, text, comment;
    beforeEach(function() {
      text = "";
      handler = {
        start: function(tag, attrs, unary){
          start = {
            tag: tag,
            attrs: attrs,
            unary: unary
          };
          // Since different browsers handle newlines differently we trim
          // so that it is easier to write tests.
          angular.forEach(attrs, function(value, key) {
            attrs[key] = value.replace(/^\s*/, '').replace(/\s*$/, '');
          });
        },
        chars: function(text_){
          text += text_;
        },
        end:function(tag) {
          expect(tag).toEqual(start.tag);
        },
        comment:function(comment_) {
          comment = comment_;
        }
      };
    });

    it('should parse comments', function() {
      htmlParser('<!--FOOBAR-->', handler);
      expect(comment).toEqual('FOOBAR');
    });

    it('should throw an exception for invalid comments', function() {
      var caught=false;
      try {
        htmlParser('<!-->', handler);
      }
      catch (ex) {
        caught = true;
        // expected an exception due to a bad parse
      }
      expect(caught).toBe(true);
    });

    it('double-dashes are not allowed in a comment', function() {
      var caught=false;
      try {
        htmlParser('<!-- -- -->', handler);
      }
      catch (ex) {
        caught = true;
        // expected an exception due to a bad parse
      }
      expect(caught).toBe(true);
    });

    it('should parse basic format', function() {
      htmlParser('<tag attr="value">text</tag>', handler);
      expect(start).toEqual({tag:'tag', attrs:{attr:'value'}, unary:false});
      expect(text).toEqual('text');
    });

    it('should not treat "<" followed by a non-/ or non-letter as a tag', function() {
      expectHTML('<- text1 text2 <1 text1 text2 <{', handler).
        toBe('&lt;- text1 text2 &lt;1 text1 text2 &lt;{');
    });

    it('should throw badparse if text content contains "<" followed by "/" without matching ">"', function() {
      expect(function() {
        htmlParser('foo </ bar', handler);
      }).toThrowMinErr('$sanitize', 'badparse', 'The sanitizer was unable to parse the following block of html: </ bar');
    });

    it('should throw badparse if text content contains "<" followed by an ASCII letter without matching ">"', function() {
      expect(function() {
        htmlParser('foo <a bar', handler);
      }).toThrowMinErr('$sanitize', 'badparse', 'The sanitizer was unable to parse the following block of html: <a bar');
    });

    it('should accept tag delimiters such as "<" inside real tags', function() {
      // Assert that the < is part of the text node content, and not part of a tag name.
      htmlParser('<p> 10 < 100 </p>', handler);
      expect(text).toEqual(' 10 < 100 ');
    });

    it('should parse newlines in tags', function() {
      htmlParser('<tag\n attr="value"\n>text</\ntag\n>', handler);
      expect(start).toEqual({tag:'tag', attrs:{attr:'value'}, unary:false});
      expect(text).toEqual('text');
    });

    it('should parse newlines in attributes', function() {
      htmlParser('<tag attr="\nvalue\n">text</tag>', handler);
      expect(start).toEqual({tag:'tag', attrs:{attr:'value'}, unary:false});
      expect(text).toEqual('text');
    });

    it('should parse namespace', function() {
      htmlParser('<ns:t-a-g ns:a-t-t-r="\nvalue\n">text</ns:t-a-g>', handler);
      expect(start).toEqual({tag:'ns:t-a-g', attrs:{'ns:a-t-t-r':'value'}, unary:false});
      expect(text).toEqual('text');
    });

    it('should parse empty value attribute of node', function() {
      htmlParser('<OPTION selected value="">abc</OPTION>', handler);
      expect(start).toEqual({tag:'option', attrs:{selected:'', value:''}, unary:false});
      expect(text).toEqual('abc');
    });
  });

  // THESE TESTS ARE EXECUTED WITH COMPILED ANGULAR
  it('should echo html', function() {
    expectHTML('hello<b class="1\'23" align=\'""\'>world</b>.').
       toEqual('hello<b class="1\'23" align="&#34;&#34;">world</b>.');
  });

  it('should remove script', function() {
    expectHTML('a<SCRIPT>evil< / scrIpt >c.').toEqual('ac.');
  });

  it('should remove DOCTYPE header', function() {
    expectHTML('<!DOCTYPE html>').toEqual('');
    expectHTML('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n"http://www.w3.org/TR/html4/strict.dtd">').toEqual('');
    expectHTML('a<!DOCTYPE html>c.').toEqual('ac.');
    expectHTML('a<!DocTyPe html>c.').toEqual('ac.');
  });

  it('should escape non-start tags', function() {
    expectHTML('a< SCRIPT >A< SCRIPT >evil< / scrIpt >B< / scrIpt >c.').
      toBe('a&lt; SCRIPT &gt;A&lt; SCRIPT &gt;evil&lt; / scrIpt &gt;B&lt; / scrIpt &gt;c.');
  });

  it('should remove attrs', function() {
    expectHTML('a<div style="abc">b</div>c').toEqual('a<div>b</div>c');
  });

  it('should remove style', function() {
    expectHTML('a<STyle>evil</stYle>c.').toEqual('ac.');
  });

  it('should remove script and style', function() {
    expectHTML('a<STyle>evil<script></script></stYle>c.').toEqual('ac.');
  });

  it('should remove double nested script', function() {
    expectHTML('a<SCRIPT>ev<script>evil</sCript>il</scrIpt>c.').toEqual('ac.');
  });

  it('should remove unknown  names', function() {
    expectHTML('a<xxx><B>b</B></xxx>c').toEqual('a<b>b</b>c');
  });

  it('should remove unsafe value', function() {
    expectHTML('<a href="javascript:alert()">').toEqual('<a></a>');
  });

  it('should handle self closed elements', function() {
    expectHTML('a<hr/>c').toEqual('a<hr/>c');
  });

  it('should handle namespace', function() {
    expectHTML('a<my:hr/><my:div>b</my:div>c').toEqual('abc');
  });

  it('should handle entities', function() {
    var everything = '<div rel="!@#$%^&amp;*()_+-={}[]:&#34;;\'&lt;&gt;?,./`~ &#295;">' +
    '!@#$%^&amp;*()_+-={}[]:&#34;;\'&lt;&gt;?,./`~ &#295;</div>';
    expectHTML(everything).toEqual(everything);
  });

  it('should mangle improper html', function() {
    // This text is encoded more than a real HTML parser would, but it should render the same.
    expectHTML('< div rel="</div>" alt=abc dir=\'"\' >text< /div>').
      toBe('&lt; div rel=&#34;&#34; alt=abc dir=\'&#34;\' &gt;text&lt; /div&gt;');
  });

  it('should mangle improper html2', function() {
    // A proper HTML parser would clobber this more in most cases, but it looks reasonable.
    expectHTML('< div rel="</div>" / >').
      toBe('&lt; div rel=&#34;&#34; / &gt;');
  });

  it('should ignore back slash as escape', function() {
    expectHTML('<img alt="xxx\\" title="><script>....">').
      toEqual('<img alt="xxx\\" title="&gt;&lt;script&gt;...."/>');
  });

  it('should ignore object attributes', function() {
    expectHTML('<a constructor="hola">:)</a>').
      toEqual('<a>:)</a>');
    expectHTML('<constructor constructor="hola">:)</constructor>').
      toEqual('');
  });

  it('should keep spaces as prefix/postfix', function() {
    expectHTML(' a ').toEqual(' a ');
  });

  it('should allow multiline strings', function() {
    expectHTML('\na\n').toEqual('&#10;a&#10;');
  });

  it('should accept tag delimiters such as "<" inside real tags (with nesting)', function() {
    //this is an integrated version of the 'should accept tag delimiters such as "<" inside real tags' test
    expectHTML('<p> 10 < <span>100</span> </p>')
    .toEqual('<p> 10 &lt; <span>100</span> </p>');
  });

  it('should accept non-string arguments', function() {
    expectHTML(null).toBe('');
    expectHTML(undefined).toBe('');
    expectHTML(42).toBe('42');
    expectHTML({}).toBe('[object Object]');
    expectHTML([1, 2, 3]).toBe('1,2,3');
    expectHTML(true).toBe('true');
    expectHTML(false).toBe('false');
  });

  describe('htmlSanitizerWriter', function() {
    /* global htmlSanitizeWriter: false */
    if (angular.isUndefined(window.htmlSanitizeWriter)) return;

    var writer, html, uriValidator;
    beforeEach(function() {
      html = '';
      uriValidator = jasmine.createSpy('uriValidator');
      writer = htmlSanitizeWriter({push:function(text){html+=text;}}, uriValidator);
    });

    it('should write basic HTML', function() {
      writer.chars('before');
      writer.start('div', {rel:'123'}, false);
      writer.chars('in');
      writer.end('div');
      writer.chars('after');

      expect(html).toEqual('before<div rel="123">in</div>after');
    });

    it('should escape text nodes', function() {
      writer.chars('a<div>&</div>c');
      expect(html).toEqual('a&lt;div&gt;&amp;&lt;/div&gt;c');
    });

    it('should escape IE script', function() {
      writer.chars('&<>{}');
      expect(html).toEqual('&amp;&lt;&gt;{}');
    });

    it('should escape attributes', function() {
      writer.start('div', {rel:'!@#$%^&*()_+-={}[]:";\'<>?,./`~ \n\0\r\u0127'});
      expect(html).toEqual('<div rel="!@#$%^&amp;*()_+-={}[]:&#34;;\'&lt;&gt;?,./`~ &#10;&#0;&#13;&#295;">');
    });

    it('should ignore missformed elements', function() {
      writer.start('d>i&v', {});
      expect(html).toEqual('');
    });

    it('should ignore unknown attributes', function() {
      writer.start('div', {unknown:""});
      expect(html).toEqual('<div>');
    });

    it('should handle surrogate pair', function() {
      writer.chars(String.fromCharCode(55357, 56374));
      expect(html).toEqual('&#128054;');
    });

    describe('explicitly disallow', function() {
      it('should not allow attributes', function() {
        writer.start('div', {id:'a', name:'a', style:'a'});
        expect(html).toEqual('<div>');
      });

      it('should not allow tags', function() {
        function tag(name) {
          writer.start(name, {});
          writer.end(name);
        }
        tag('frameset');
        tag('frame');
        tag('form');
        tag('param');
        tag('object');
        tag('embed');
        tag('textarea');
        tag('input');
        tag('button');
        tag('option');
        tag('select');
        tag('script');
        tag('style');
        tag('link');
        tag('base');
        tag('basefont');
        expect(html).toEqual('');
      });
    });

    describe('uri validation', function() {
      it('should call the uri validator', function() {
        writer.start('a', {href:'someUrl'}, false);
        expect(uriValidator).toHaveBeenCalledWith('someUrl', false);
        uriValidator.reset();
        writer.start('img', {src:'someImgUrl'}, false);
        expect(uriValidator).toHaveBeenCalledWith('someImgUrl', true);
        uriValidator.reset();
        writer.start('someTag', {src:'someNonUrl'}, false);
        expect(uriValidator).not.toHaveBeenCalled();
      });

      it('should drop non valid uri attributes', function() {
        uriValidator.andReturn(false);
        writer.start('a', {href:'someUrl'}, false);
        expect(html).toEqual('<a>');

        html = '';
        uriValidator.andReturn(true);
        writer.start('a', {href:'someUrl'}, false);
        expect(html).toEqual('<a href="someUrl">');
      });
    });
  });

  describe('uri checking', function() {
    beforeEach(function() {
      this.addMatchers({
        toBeValidUrl: function() {
          var sanitize;
          inject(function($sanitize) {
            sanitize = $sanitize;
          });
          var input = '<a href="'+this.actual+'"></a>';
          return sanitize(input) === input;
        },
        toBeValidImageSrc: function() {
          var sanitize;
          inject(function($sanitize) {
            sanitize = $sanitize;
          });
          var input = '<img src="'+this.actual+'"/>';
          return sanitize(input) === input;
        }
      });
    });

    it('should use $$sanitizeUri for links', function() {
      var $$sanitizeUri = jasmine.createSpy('$$sanitizeUri');
      module(function($provide) {
        $provide.value('$$sanitizeUri', $$sanitizeUri);
      });
      inject(function() {
        $$sanitizeUri.andReturn('someUri');

        expectHTML('<a href="someUri"></a>').toEqual('<a href="someUri"></a>');
        expect($$sanitizeUri).toHaveBeenCalledWith('someUri', false);

        $$sanitizeUri.andReturn('unsafe:someUri');
        expectHTML('<a href="someUri"></a>').toEqual('<a></a>');
      });
    });

    it('should use $$sanitizeUri for links', function() {
      var $$sanitizeUri = jasmine.createSpy('$$sanitizeUri');
      module(function($provide) {
        $provide.value('$$sanitizeUri', $$sanitizeUri);
      });
      inject(function() {
        $$sanitizeUri.andReturn('someUri');

        expectHTML('<img src="someUri"/>').toEqual('<img src="someUri"/>');
        expect($$sanitizeUri).toHaveBeenCalledWith('someUri', true);

        $$sanitizeUri.andReturn('unsafe:someUri');
        expectHTML('<img src="someUri"/>').toEqual('<img/>');
      });
    });

    it('should be URI', function() {
      expect('').toBeValidUrl();
      expect('http://abc').toBeValidUrl();
      expect('HTTP://abc').toBeValidUrl();
      expect('https://abc').toBeValidUrl();
      expect('HTTPS://abc').toBeValidUrl();
      expect('ftp://abc').toBeValidUrl();
      expect('FTP://abc').toBeValidUrl();
      expect('mailto:me@example.com').toBeValidUrl();
      expect('MAILTO:me@example.com').toBeValidUrl();
      expect('tel:123-123-1234').toBeValidUrl();
      expect('TEL:123-123-1234').toBeValidUrl();
      expect('#anchor').toBeValidUrl();
      expect('/page1.md').toBeValidUrl();
    });

    it('should not be URI', function() {
      /* jshint scripturl: true */
      expect('javascript:alert').not.toBeValidUrl();
    });

    describe('javascript URLs', function() {
      it('should ignore javascript:', function() {
        /* jshint scripturl: true */
        expect('JavaScript:abc').not.toBeValidUrl();
        expect(' \n Java\n Script:abc').not.toBeValidUrl();
        expect('http://JavaScript/my.js').toBeValidUrl();
      });

      it('should ignore dec encoded javascript:', function() {
        expect('&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;').not.toBeValidUrl();
        expect('&#106&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;').not.toBeValidUrl();
        expect('&#106 &#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;').not.toBeValidUrl();
      });

      it('should ignore decimal with leading 0 encodede javascript:', function() {
        expect('&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058').not.toBeValidUrl();
        expect('&#0000106 &#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058').not.toBeValidUrl();
        expect('&#0000106; &#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058').not.toBeValidUrl();
      });

      it('should ignore hex encoded javascript:', function() {
        expect('&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A;').not.toBeValidUrl();
        expect('&#x6A;&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A;').not.toBeValidUrl();
        expect('&#x6A &#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A;').not.toBeValidUrl();
      });

      it('should ignore hex encoded whitespace javascript:', function() {
        expect('jav&#x09;ascript:alert();').not.toBeValidUrl();
        expect('jav&#x0A;ascript:alert();').not.toBeValidUrl();
        expect('jav&#x0A ascript:alert();').not.toBeValidUrl();
        expect('jav\u0000ascript:alert();').not.toBeValidUrl();
        expect('java\u0000\u0000script:alert();').not.toBeValidUrl();
        expect(' &#14; java\u0000\u0000script:alert();').not.toBeValidUrl();
      });
    });
  });

  describe('sanitizeText', function() {
    /* global sanitizeText: false */
    it('should escape text', function() {
      expect(sanitizeText('a<div>&</div>c')).toEqual('a&lt;div&gt;&amp;&lt;/div&gt;c');
    });
  });
});

describe('decodeEntities', function() {
  var handler, text,
      origHiddenPre = window.hiddenPre;

  beforeEach(function() {
    text = '';
    handler = {
      start: function() {},
      chars: function(text_){
        text = text_;
      },
      end: function() {},
      comment: function() {}
    };
    module('ngSanitize');
  });

  afterEach(function() {
    window.hiddenPre = origHiddenPre;
  });

  it('should use innerText if textContent is not available (IE<9)', function() {
    window.hiddenPre = {
      innerText: 'INNER_TEXT'
    };
    inject(function($sanitize) {
      htmlParser('<tag>text</tag>', handler);
      expect(text).toEqual('INNER_TEXT');
    });
  });
  it('should use textContent if available', function() {
    window.hiddenPre = {
      textContent: 'TEXT_CONTENT',
      innerText: 'INNER_TEXT'
    };
    inject(function($sanitize) {
      htmlParser('<tag>text</tag>', handler);
      expect(text).toEqual('TEXT_CONTENT');
    });
  });
  it('should use textContent even if empty', function() {
    window.hiddenPre = {
      textContent: '',
      innerText: 'INNER_TEXT'
    };
    inject(function($sanitize) {
      htmlParser('<tag>text</tag>', handler);
      expect(text).toEqual('');
    });
  });
});
