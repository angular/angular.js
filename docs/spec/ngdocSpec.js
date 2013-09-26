var ngdoc = require('../src/ngdoc.js');
var DOM = require('../src/dom.js').DOM;

describe('ngdoc', function() {
  var Doc = ngdoc.Doc;
  var dom;

  beforeEach(function() {
    dom = new DOM();
    this.addMatchers({
      toContain: function(text) {
        this.actual = this.actual.toString();
        return this.actual.indexOf(text) > -1;
      }
    });
  });

  describe('Doc', function() {
    describe('metadata', function() {

      it('should find keywords and filter ignored words', function() {
        expect(new Doc('\nHello: World! @ignore. $abc').keywords()).toEqual('$abc hello world');
        expect(new Doc('The `ng:class-odd` and').keywords()).toEqual('ng:class-odd');
      });

      it('should get property and methods', function() {
        var doc = new Doc('Document');
        doc.properties.push(new Doc('Proprety'));
        doc.properties.push(new Doc('Method'));
        expect(doc.keywords()).toEqual('document method proprety');
      });

      it('should have shortName', function() {
        var d1 = new Doc('@name a.b.c').parse();
        var d2 = new Doc('@name a.b.ng-c').parse();
        var d3 = new Doc('@name some text: more text').parse();
        expect(ngdoc.metadata([d1])[0].shortName).toEqual('c');
        expect(ngdoc.metadata([d2])[0].shortName).toEqual('ng-c');
        expect(ngdoc.metadata([d3])[0].shortName).toEqual('more text');
      });

    });

    describe('parse', function() {
      it('should convert @names into properties', function() {
        var doc = new Doc('\n@name name\n@desc\ndesc\ndesc2\n@dep\n');
        doc.parse();
        expect(doc.name).toEqual('name');
        expect(doc.desc).toEqual('desc\ndesc2');
        expect(doc.dep).toEqual('');
      });

      it('should parse parameters', function() {
        var doc = new Doc(
            '@name a\n' +
            '@param {*} a short\n' +
            '@param {Type} b med\n' +
            '@param {Class=} [c=2] long\nline\n' +
            '@param {function(number, string=)} d fn with optional arguments');
        doc.parse();
        expect(doc.param).toEqual([
           {name:'a', description:'<div class="a-page"><p>short</p>\n</div>', type:'*', optional:false, 'default':undefined},
           {name:'b', description:'<div class="a-page"><p>med</p>\n</div>', type:'Type', optional:false, 'default':undefined},
           {name:'c', description:'<div class="a-page"><p>long\nline</p>\n</div>', type:'Class', optional:true, 'default':'2'},
           {name:'d', description:'<div class="a-page"><p>fn with optional arguments</p>\n</div>',
             type: 'function(number, string=)', optional: false, 'default':undefined}
         ]);
      });

      it('should parse return', function() {
        var doc = new Doc('@name a\n@returns {Type} text *bold*.');
        doc.parse();
        expect(doc.returns).toEqual({
          type: 'Type',
          description: '<div class="a-page"><p>text <em>bold</em>.</p>\n</div>'
        });
      });

      it('should parse filename', function() {
        var doc = new Doc('@name friendly name', 'docs/a.b.ngdoc', 1);
        doc.parse(0);
        expect(doc.id).toEqual('a.b');
        expect(doc.name).toEqual('friendly name');
      });

      it('should store all links', function() {
        var doc = new Doc('@name a\n@description {@link api/angular.link}');
        doc.parse();

        expect(doc.links).toContain('api/angular.link');
      });

      describe('convertUrlToAbsolute', function() {
        var doc;

        beforeEach(function() {
          doc = new Doc({section: 'section'});
        });

        it('should not change absolute url', function() {
          expect(doc.convertUrlToAbsolute('guide/index')).toEqual('guide/index');
        });

        it('should prepend current section to relative url', function() {
          expect(doc.convertUrlToAbsolute('angular.widget')).toEqual('section/angular.widget');
        });

        it('should change id to index if not specified', function() {
          expect(doc.convertUrlToAbsolute('guide/')).toEqual('guide/index');
        });
      });

      describe('sorting', function() {
        function property(name) {
          return function(obj) {return obj[name];};
        }
        function noop() {}
        function doc(type, name){
          return {
              id: name,
              ngdoc: type,
              keywords: noop
          };
        }

        var dev_guide_overview = doc('overview', 'dev_guide.overview');
        var dev_guide_bootstrap = doc('function', 'dev_guide.bootstrap');

        it('should put angular.fn() in front of dev_guide.overview, etc', function() {
          expect(ngdoc.metadata([dev_guide_overview, dev_guide_bootstrap]).map(property('id')))
            .toEqual(['dev_guide.overview', 'dev_guide.bootstrap']);
        });
      });
    });
  });

  describe('markdown', function() {
    it('should not replace anything in <pre>, but escape the html escape the content', function() {
      expect(new Doc().markdown('bah x\n<pre>\n<b>angular</b>.k\n</pre>\n asdf x')).
        toEqual(
            '<div class="docs-page"><p>bah x\n' +
            '<pre class="prettyprint linenums">\n' +
            '&lt;b&gt;angular&lt;/b&gt;.k\n' +
            '</pre>\n' +
            ' asdf x</p>\n</div>');
    });

    it('should wrap everything inside a container tag', function() {
      var doc = new Doc('@name superman').parse();
      var content = doc.markdown('hello');

      expect(content).toMatch('<div class="superman-page"><p>hello</p>\n</div>');
    });

    it('should use the content before a colon as the name prefix for the className of the tag container', function() {
      var doc = new Doc('@name super: man').parse();
      var content = doc.markdown('hello');

      expect(content).toMatch('<div class="super-page super-man-page"><p>hello</p>\n</div>');
    });

    it('should replace text between two <pre></pre> tags', function() {
      expect(new Doc().markdown('<pre>x</pre>\n# One\n<pre>b</pre>')).
        toMatch('</pre>\n<h1>One</h1>\n<pre');
    });

    it('should replace inline variable type hints', function() {
      expect(new Doc().markdown('{@type string}')).
        toMatch(/<a\s+.*?class=".*?type-hint type-hint-string.*?".*?>/);
    });

    it('should ignore nested doc widgets', function() {
      expect(new Doc().markdown(
        'before\n<div class="tabbable">\n' +
          '<div class="tab-pane well" id="git-mac" ng:model="Git on Mac/Linux">' +
          '\ngit bla bla\n</div>\n' +
        '</div>')).toEqual(

        '<div class="docs-page"><p>before</p>\n<div class="tabbable">\n' +
          '<div class="tab-pane well" id="git-mac" ng:model="Git on Mac/Linux">\n' +
          'git bla bla\n' +
          '</div>\n' +
        '</div></div>');
      });

    it('should unindent text before processing based on the second line', function() {
      expect(new Doc().markdown('first line\n' +
                                '   second line\n\n' +
                                '       third line\n' +
                                '        fourth line\n\n' +
                                '   fifth line')).
        toMatch('<p>first line\n' +
                'second line</p>\n' +
                '<pre><code>third line\n' +
                ' fourth line</code></pre>\n' +
                '<p>fifth line</p>\n');
    });

    it('should unindent text before processing based on the first line', function() {
      expect(new Doc().markdown('   first line\n\n' +
                                '       second line\n' +
                                '       third line\n' +
                                '        fourth line\n\n' +
                                '   fifth line')).
        toMatch('<div class="docs-page"><p>first line</p>\n' +
                '<pre><code>second line\n' +
                'third line\n' +
                ' fourth line</code></pre>\n' +
                '<p>fifth line</p>\n</div>');
    });


    describe('inline annotations', function() {
      it('should convert inline docs annotations into proper HTML', function() {
        expect(new Doc().markdown(
          "<pre>\n//!annotate supertext\n<br />\n</pre>"
          )
        ).toContain('data-popover data-content="supertext"')
      });

      it('should allow for a custom regular expression for matching', function() {
        expect(new Doc().markdown(
          "<pre>\n//!annotate=\"soon\" supertext\n<p>soon</p>\n</pre>"
          )
        ).toContain('data-popover data-content="supertext" data-title="Info">soon</div>')
      });

      it('should allow for a custom title to be set', function() {
        expect(new Doc().markdown(
          "<pre>\n//!annotate=\"soon\" coming soon|supertext\n<p>soon</p>\n</pre>"
          )
        ).toContain('data-popover data-content="supertext" data-title="coming soon">soon</div>')
      });
    });
  });

  describe('trim', function() {
    var trim = ngdoc.trim;
    it('should remove leading/trailing space', function() {
      expect(trim('  \nabc\n  ')).toEqual('abc');
    });

    it('should remove leading space on every line', function() {
      expect(trim('\n 1\n  2\n   3\n')).toEqual('1\n 2\n  3');
    });
  });

  describe('merge', function() {
    it('should merge child with parent', function() {
      var parent = new Doc({id: 'ng.abc', name: 'ng.abc', section: 'api'});
      var methodA = new Doc({name: 'methodA', methodOf: 'ng.abc'});
      var methodB = new Doc({name: 'methodB', methodOf: 'ng.abc'});
      var propA = new Doc({name: 'propA', propertyOf: 'ng.abc'});
      var propB = new Doc({name: 'propB', propertyOf: 'ng.abc'});
      var eventA = new Doc({name: 'eventA', eventOf: 'ng.abc'});
      var eventB = new Doc({name: 'eventB', eventOf: 'ng.abc'});
      var docs = [methodB, methodA, eventB, eventA, propA, propB, parent]; // keep wrong order;
      ngdoc.merge(docs);
      expect(docs.length).toEqual(1);
      expect(docs[0].id).toEqual('ng.abc');
      expect(docs[0].methods).toEqual([methodA, methodB]);
      expect(docs[0].events).toEqual([eventA, eventB]);
      expect(docs[0].properties).toEqual([propA, propB]);
    });



    describe('links checking', function() {
      var docs;
      beforeEach(function() {
        spyOn(console, 'log');
        docs = [new Doc({section: 'api', id: 'fake.id1', links: ['non-existing-link']}),
                new Doc({section: 'api', id: 'fake.id2'}),
                new Doc({section: 'api', id: 'fake.id3'})];
      });

      it('should log warning when any link doesn\'t exist', function() {
        ngdoc.merge(docs);
        expect(console.log).toHaveBeenCalled();
        expect(console.log.argsForCall[0][0]).toContain('WARNING:');
      });

      it('should say which link doesn\'t exist', function() {
        ngdoc.merge(docs);
        expect(console.log.argsForCall[0][0]).toContain('non-existing-link');
      });

      it('should say where is the non-existing link', function() {
        ngdoc.merge(docs);
        expect(console.log.argsForCall[0][0]).toContain('api/fake.id1');
      });
    });
  });

  ////////////////////////////////////////

  describe('TAG', function() {
    describe('@param', function() {
      it('should parse with no default', function() {
        var doc = new Doc('@name a\n@param {(number|string)} number Number \n to format.');
        doc.parse();
        expect(doc.param).toEqual([{
          type : '(number|string)',
          name : 'number',
          optional: false,
          'default' : undefined,
          description : '<div class="a-page"><p>Number \nto format.</p>\n</div>' }]);
      });

      it('should parse with default and optional', function() {
        var doc = new Doc('@name a\n@param {(number|string)=} [fractionSize=2] desc');
        doc.parse();
        expect(doc.param).toEqual([{
          type : '(number|string)',
          name : 'fractionSize',
          optional: true,
          'default' : '2',
          description : '<div class="a-page"><p>desc</p>\n</div>' }]);
      });
    });

    describe('@requires', function() {
      it('should parse more @requires tag into array', function() {
        var doc = new Doc('@name a\n@requires $service for \n`A`\n@requires $another for `B`');
        doc.ngdoc = 'service';
        doc.parse();
        expect(doc.requires).toEqual([
          {name:'$service', text:'<div class="a-page"><p>for \n<code>A</code></p>\n</div>'},
          {name:'$another', text:'<div class="a-page"><p>for <code>B</code></p>\n</div>'}]);
        expect(doc.html()).toContain('<a href="api/ng.$service">$service</a>');
        expect(doc.html()).toContain('<a href="api/ng.$another">$another</a>');
        expect(doc.html()).toContain('<p>for \n<code>A</code></p>');
        expect(doc.html()).toContain('<p>for <code>B</code></p>');
      });
    });

    describe('@scope', function() {
      it('should state the new scope will be created', function() {
        var doc = new Doc('@name a\n@scope');
        doc.ngdoc = 'directive';
        doc.parse();
        expect(doc.scope).toEqual('');
        expect(doc.html()).toContain('This directive creates new scope.');
      });
    });

    describe('@priority', function() {
      it('should state the priority', function() {
        var doc = new Doc('@name a\n@priority 123');
        doc.ngdoc = 'directive';
        doc.parse();
        expect(doc.priority).toEqual('123');
        expect(doc.html()).toContain('This directive executes at priority level 123.');
      });
    });

    describe('@property', function() {
      it('should parse @property tags into array', function() {
        var doc = new Doc("@name a\n@property {type} name1 desc\n@property {type} name2 desc");
        doc.parse();
        expect(doc.properties.length).toEqual(2);
      });

      it('should not parse @property without a type', function() {
        var doc = new Doc("@property fake", 'test.js', '44');
        expect(function() { doc.parse(); }).
          toThrow(new Error("Not a valid 'property' format: fake (found in: test.js:44)"));
      });

      it('should parse @property with type', function() {
        var doc = new Doc("@name a\n@property {string} name");
        doc.parse();
        expect(doc.properties[0].name).toEqual('name');
        expect(doc.properties[0].type).toEqual('string');
      });

      it('should parse @property with optional description', function() {
        var doc = new Doc("@name a\n@property {string} name desc rip tion");
        doc.parse();
        expect(doc.properties[0].name).toEqual('name');
        expect(doc.properties[0].description).toEqual('<div class="a-page"><p>desc rip tion</p>\n</div>');
      });

      it('should parse @property with type and description both', function() {
        var doc = new Doc("@name a\n@property {bool} name desc rip tion");
        doc.parse();
        expect(doc.properties[0].name).toEqual('name');
        expect(doc.properties[0].type).toEqual('bool');
        expect(doc.properties[0].description).toEqual('<div class="a-page"><p>desc rip tion</p>\n</div>');
      });

    });

    describe('@returns', function() {
      it('should not parse @returns without type', function() {
        var doc = new Doc("@returns lala");
        expect(function() { doc.parse(); }).
            toThrow();
      });


      it('should not parse @returns with invalid type', function() {
        var doc = new Doc("@returns {xx}x} lala", 'test.js', 34);
        expect(function() { doc.parse(); }).
            toThrow(new Error("Not a valid 'returns' format: {xx}x} lala (found in: test.js:34)"));
      });


      it('should parse @returns with type and description', function() {
        var doc = new Doc("@name a\n@returns {string} descrip tion");
        doc.parse();
        expect(doc.returns).toEqual({type: 'string', description: '<div class="a-page"><p>descrip tion</p>\n</div>'});
      });

      it('should parse @returns with complex type and description', function() {
        var doc = new Doc("@name a\n@returns {function(string, number=)} description");
        doc.parse();
        expect(doc.returns).toEqual({type: 'function(string, number=)', description: '<div class="a-page"><p>description</p>\n</div>'});
      });

      it('should transform description of @returns with markdown', function() {
        var doc = new Doc("@name a\n@returns {string} descrip *tion*");
        doc.parse();
        expect(doc.returns).toEqual({type: 'string', description: '<div class="a-page"><p>descrip <em>tion</em></p>\n</div>'});
      });

      it('should support multiline content', function() {
        var doc = new Doc("@name a\n@returns {string} description\n new line\n another line");
        doc.parse();
        expect(doc.returns).
          toEqual({type: 'string', description: '<div class="a-page"><p>description\nnew line\nanother line</p>\n</div>'});
      });
    });

    describe('@description', function() {
      it('should support pre blocks', function() {
        var doc = new Doc("@name a\n@description <pre><b>abc</b></pre>");
        doc.parse();
        expect(doc.description).
          toBe('<div class="a-page"><pre class="prettyprint linenums">&lt;b&gt;abc&lt;/b&gt;</pre>\n</div>');
      });

      it('should support multiple pre blocks', function() {
        var doc = new Doc("@name a\n@description foo \n<pre>abc</pre>\n#bah\nfoo \n<pre>cba</pre>");
        doc.parse();
        expect(doc.description).
          toBe('<div class="a-page"><p>foo \n' +
               '<pre class="prettyprint linenums">abc</pre>\n' +
               '<h1>bah</h1>\n' +
               '<p>foo \n' +
               '<pre class="prettyprint linenums">cba</pre>\n</div>');
      });

      it('should support nested @link annotations with or without description', function() {
        var doc = new Doc("@name a\n@description " +
            'foo {@link angular.foo}\n\n da {@link angular.foo bar foo bar } \n\n' +
            'dad{@link angular.foo}\n\n' +
            'external{@link http://angularjs.org}\n\n' +
            'external{@link ./static.html}\n\n' +
            '{@link angular.directive.ng-foo ng:foo}');

        doc.section = 'api';
        doc.parse();

        expect(doc.description).
          toContain('foo <a href="api/angular.foo"><code>angular.foo</code></a>');
        expect(doc.description).
          toContain('da <a href="api/angular.foo"><code>bar foo bar</code></a>');
        expect(doc.description).
          toContain('dad<a href="api/angular.foo"><code>angular.foo</code></a>');
        expect(doc.description).
          toContain('<a href="api/angular.directive.ng-foo"><code>ng:foo</code></a>');
        expect(doc.description).
          toContain('<a href="http://angularjs.org">http://angularjs.org</a>');
        expect(doc.description).
          toContain('<a href="./static.html">./static.html</a>');
      });

      it('should support line breaks in @link', function() {
        var doc = new Doc("@name a\n@description " +
            '{@link\napi/angular.foo\na\nb}');
        doc.parse();
        expect(doc.description).
          toContain('<a href="api/angular.foo"><code>a b</code></a>');
      });

    });

    describe('@example', function() {
      it('should not remove {{}}', function() {
        var doc = new Doc('@name a\n@example text {{ abc }}');
        doc.parse();
        expect(doc.example).toEqual('<div class="a-page"><p>text {{ abc }}</p>\n</div>');
      });
    });

    describe('@deprecated', function() {
      it('should parse @deprecated', function() {
        var doc = new Doc('@name a\n@deprecated Replaced with foo.');
        doc.parse();
        expect(doc.deprecated).toBe('Replaced with foo.');
      });
    });

    describe('@this', function() {
      it('should render @this', function() {
        var doc = new Doc('@name a\n@this I am self.');
        doc.ngdoc = 'filter';
        doc.parse();
        expect(doc.html()).toContain('<h3>Method\'s <code>this</code></h3>\n' +
            '<div>' +
            '<div class="a-page">' +
            '<p>I am self.</p>\n' +
            '</div>' +
            '</div>\n');
        expect(doc.html()).toContain('<h3>Method\'s <code>this</code></h3>\n' +
            '<div><div class="a-page"><p>I am self.</p>\n</div></div>');
      });
    });

    describe('@animations', function() {
      it('should render @this', function() {
        var doc = new Doc('@name a\n@animations\nenter - Add text\nleave - Remove text\n');
        doc.ngdoc = 'filter';
        doc.parse();
        expect(doc.html()).toContain(
            '<h3 id="Animations">Animations</h3>\n' +
            '<div class="animations">' +
              '<ul>' +
                '<li>enter - Add text</li>' +
                '<li>leave - Remove text</li>' +
              '</ul>' +
            '</div>');
      });
    });
  });

  describe('usage', function() {
    describe('overview', function() {
      it('should supress description heading', function() {
        var doc = new Doc('@ngdoc overview\n@name angular\n@description\n#heading\ntext');
        doc.parse();
        expect(doc.html()).toContain('text');
        expect(doc.html()).toContain('<h2>heading</h2>');
        expect(doc.html()).not.toContain('Description');
      });
    });


     describe('function', function() {
      it('should format', function() {
        var doc = new Doc({
          ngdoc:'function',
          name:'some.name',
          param: [
            {name:'a', type: 'string', optional: true},
            {name:'b', type: 'someType', optional: true, 'default': '"xxx"'},
            {name:'c', type: 'string', description: 'param desc'}
          ],
          returns: {type: 'number', description: 'return desc'}
        });
        doc.html_usage_function(dom);
        expect(dom).toContain('name([a][, b], c)'); //TODO(i) the comma position here is lame
        expect(dom).toContain('param desc');
        expect(dom).toContain('(optional)');
        expect(dom).toContain('return desc');
      });
    });

    describe('filter', function() {
      it('should format', function() {
        var doc = new Doc({
          ngdoc:'formatter',
          shortName:'myFilter',
          param: [
            {name:'a', type:'string'},
            {name:'b', type:'string'}
          ]
        });
        doc.html_usage_filter(dom);
        expect(dom).toContain('myFilter_expression | myFilter:b');
        expect(dom).toContain('$filter(\'myFilter\')(a, b)');
      });
    });

    describe('property', function() {
      it('should format', function() {
        var doc = new Doc({
          ngdoc:'property',
          name:'myProp',
          type:'string',
          returns:{type: 'type', description: 'description'}
        });
        doc.html_usage_property(dom);
        expect(dom).toContain('myProp');
        expect(dom).toContain('type');
        expect(dom).toContain('description');
      });
    });
  });

});
