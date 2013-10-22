'use strict';

describe('HTML', function() {

  var expectHTML;

  beforeEach(module('ngSanitize'));

  beforeEach(inject(function($sanitize) {
    expectHTML = function(html){
      return expect($sanitize(html));
    };
  }));

  describe('htmlParser', function() {
    if (angular.isUndefined(window.htmlParser)) return;

    var handler, start, text, comment;
    beforeEach(function() {
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
              attrs[key] = value.replace(/^\s*/, '').replace(/\s*$/, '')
            });
          },
          chars: function(text_){
            text = text_;
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

    it('should parse newlines in tags', function() {
      htmlParser('<\ntag\n attr="value"\n>text<\n/\ntag\n>', handler);
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

  it('should remove nested script', function() {
    expectHTML('a< SCRIPT >A< SCRIPT >evil< / scrIpt >B< / scrIpt >c.').toEqual('ac.');
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

  it('should handle improper html', function() {
    expectHTML('< div rel="</div>" alt=abc dir=\'"\' >text< /div>').
      toEqual('<div rel="&lt;/div&gt;" alt="abc" dir="&#34;">text</div>');
  });

  it('should handle improper html2', function() {
    expectHTML('< div rel="</div>" / >').
      toEqual('<div rel="&lt;/div&gt;"/>');
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

  describe('htmlSanitizerWriter', function() {
    if (angular.isUndefined(window.htmlSanitizeWriter)) return;

    var writer, html;
    beforeEach(function() {
      html = '';
      writer = htmlSanitizeWriter({push:function(text){html+=text;}});
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

    describe('isUri', function() {

      function isUri(value) {
        return value.match(URI_REGEXP);
      }

      it('should be URI', function() {
        expect(isUri('http://abc')).toBeTruthy();
        expect(isUri('HTTP://abc')).toBeTruthy();
        expect(isUri('https://abc')).toBeTruthy();
        expect(isUri('HTTPS://abc')).toBeTruthy();
        expect(isUri('ftp://abc')).toBeTruthy();
        expect(isUri('FTP://abc')).toBeTruthy();
        expect(isUri('mailto:me@example.com')).toBeTruthy();
        expect(isUri('MAILTO:me@example.com')).toBeTruthy();
        expect(isUri('tel:123-123-1234')).toBeTruthy();
        expect(isUri('TEL:123-123-1234')).toBeTruthy();
        expect(isUri('#anchor')).toBeTruthy();
      });

      it('should not be URI', function() {
        expect(isUri('')).toBeFalsy();
        expect(isUri('javascript:alert')).toBeFalsy();
      });
    });

    describe('javascript URL attribute', function() {
      beforeEach(function() {
        this.addMatchers({
          toBeValidUrl: function() {
            return URI_REGEXP.exec(this.actual);
          }
        });
      });

      it('should ignore javascript:', function() {
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
        expect('jav&#x09;ascript:alert("A");').not.toBeValidUrl();
        expect('jav&#x0A;ascript:alert("B");').not.toBeValidUrl();
        expect('jav&#x0A ascript:alert("C");').not.toBeValidUrl();
        expect('jav\u0000ascript:alert("D");').not.toBeValidUrl();
        expect('java\u0000\u0000script:alert("D");').not.toBeValidUrl();
        expect(' &#14; java\u0000\u0000script:alert("D");').not.toBeValidUrl();
      });
    });


  });
});
