console.log(__dirname);
require.paths.push(__dirname + "/../");
require.paths.push(__dirname + "/../../");
var fs = require('fs');
var Script = process.binding('evals').Script;
var collect = load('docs/collect.js');

describe('collect', function(){
  describe('markdown', function(){
    it('should replace angular in markdown', function(){
      expect(collect.markdown('<angular/>')).
        toEqual('<p><tt>&lt;angular/&gt;</tt></p>');
    });
    
    it('should not replace anything in <pre>', function(){
      expect(collect.markdown('bah x\n<pre>\nangular.k\n</pre>\n asdf x')).
        toEqual(
            '<p>bah x</p>' +
            '<pre>\nangular.k\n</pre>' + 
            '<p>asdf x</p>');
    });
    
    it('should replace text between two <pre></pre> tags', function() {
      expect(collect.markdown('<pre>x</pre># One<pre>b</pre>')).
        toEqual('<pre>x</pre><h1>One</h1><pre>b</pre>');
    });
  });
  
  describe('processNgDoc', function() {
    var processNgDoc = collect.processNgDoc,
        documentation;

    beforeEach(function() {
      documentation = {
        pages: [],
        byName: {}
      };
    });
    
    it('should store references to docs by name', function() {
      var doc = {ngdoc: 'section', name: 'fake', raw: {text:''}};
      processNgDoc(documentation, doc);
      expect(documentation.byName.fake).toBe(doc);
    });
    
    it('should connect doc to owner (specified by @methodOf)', function() {
      var parentDoc = {ngdoc: 'section', name: 'parent', raw: {text:''}};
      var doc = {ngdoc: 'section', name: 'child', methodOf: 'parent', raw: {text:''}};
      processNgDoc(documentation, parentDoc);
      processNgDoc(documentation, doc);
      expect(documentation.byName.parent.method).toBeDefined();
      expect(documentation.byName.parent.method[0]).toBe(doc);
    });
    
    it('should not add doc to sections if @memberOf specified', function() {
      var parentDoc = {ngdoc: 'parent', name: 'parent', raw: {text:''}};
      var doc = {ngdoc: 'child', name: 'child', methodOf: 'parent', raw: {text:''}};
      processNgDoc(documentation, parentDoc);
      processNgDoc(documentation, doc);
      expect(documentation.pages.child).not.toBeDefined();
    });
    
    it('should throw exception if owner does not exist', function() {
      expect(function() {
        processNgDoc(documentation, {ngdoc: 'section', methodOf: 'not.exist', raw: {text:''}});
      }).toThrow('Owner "not.exist" is not defined.');
    });
    
    it('should ignore non-ng docs', function() {
      var doc = {name: 'anything'};
      expect(function() {
        processNgDoc(documentation, doc);
      }).not.toThrow();
      expect(documentation.pages).not.toContain(doc);
    });
  });
  
  describe('TAG', function(){
    var TAG = collect.TAG;
    var doc;
    beforeEach(function(){
      doc = {};
    });
    
    describe('@param', function(){
      it('should parse with no default', function(){
        TAG.param(doc, 'param', 
            '{(number|string)} number Number \n to format.');
        expect(doc.param).toEqual([{ 
          type : '(number|string)', 
          name : 'number',
          optional: false,
          'default' : undefined, 
          description : 'Number \n to format.' }]);
      });
      it('should parse with default and optional', function(){
        TAG.param(doc, 'param', 
            '{(number|string)=} [fractionSize=2] desc');
        expect(doc.param).toEqual([{ 
          type : '(number|string)', 
          name : 'fractionSize',
          optional: true,
          'default' : '2', 
          description : 'desc' }]);
      });
    });
    
    describe('@requires', function() {
      it('should parse more @requires tag into array', function() {
        TAG.requires(doc, 'requires', '$service');
        TAG.requires(doc, 'requires', '$another');
        
        expect(doc.requires).toEqual([
          {name: '$service'},
          {name: '$another'}
        ]);
      });
    });

    describe('@property', function() {
      it('should parse @property tags into array', function() {
        TAG.property(doc, 'property', '{type} name1 desc');
        TAG.property(doc, 'property', '{type} name2 desc');
        expect(doc.property.length).toEqual(2);
      });
      
      it('should parse @property with only name', function() {
        TAG.property(doc, 'property', 'fake');
        expect(doc.property[0].name).toEqual('fake');
      });
      
      it('should parse @property with optional type', function() {
        TAG.property(doc, 'property', '{string} name');
        expect(doc.property[0].name).toEqual('name');
        expect(doc.property[0].type).toEqual('string');
      });
      
      it('should parse @property with optional description', function() {
        TAG.property(doc, 'property', 'name desc rip tion');
        expect(doc.property[0].name).toEqual('name');
        expect(doc.property[0].description).toEqual('desc rip tion');
      });
      
      it('should parse @property with type and description both', function() {
        TAG.property(doc, 'property', '{bool} name desc rip tion');
        expect(doc.property[0].name).toEqual('name');
        expect(doc.property[0].type).toEqual('bool');
        expect(doc.property[0].description).toEqual('desc rip tion');
      });
      
      /**
       * If property description is undefined, this variable is not set in the template,
       * so the whole @description tag is used instead
       */
      it('should set undefined description to "false"', function() {
        TAG.property(doc, 'property', 'name');
        expect(doc.property[0].description).toBe(false);
      });
    });
    
    describe('@methodOf', function() {
      it('should parse @methodOf tag', function() {
        expect(function() {
          TAG.methodOf(doc, 'methodOf', 'parentName');
        }).not.toThrow();
        expect(doc.methodOf).toEqual('parentName');
      });
    });
    
    describe('@returns', function() {
      it('should not parse @returns without type', function() {
      expect(function() {TAG.returns(doc, 'returns', 'lala');})
        .toThrow();
      });
      
      it('should parse @returns with type and description', function() {
        TAG.returns(doc, 'returns', '{string} descrip tion');
        expect(doc.returns).toEqual({type: 'string', description: 'descrip tion'});
      });

      it('should transform description of @returns with markdown', function() {
        TAG.returns(doc, 'returns', '{string} descrip *tion*');
        expect(doc.returns).toEqual({type: 'string', description: 'descrip <em>tion</em>'});
      });
    });
    
    describe('@description', function(){
      it('should support pre blocks', function(){
        TAG.description(doc, 'description', '<pre>abc</pre>');
        expect(doc.description).
          toBe('<div ng:non-bindable><pre class="brush: js; html-script: true;">abc</pre></div>');
      });

      it('should support multiple pre blocks', function() {
        TAG.description(doc, 'description', 'foo \n<pre>abc</pre>\n#bah\nfoo \n<pre>cba</pre>');
        expect(doc.description).
          toBe('<p>foo </p>' +
               '<div ng:non-bindable><pre class="brush: js; html-script: true;">abc</pre></div>' +
               '<h2>bah</h2>\n\n' +
               '<p>foo </p>' +
               '<div ng:non-bindable><pre class="brush: js; html-script: true;">cba</pre></div>');

      });

      it('should support nested @link annotations with or without description', function() {
        TAG.description(doc, 'description',
            'foo {@link angular.foo}\n\n da {@link angular.foo bar foo bar } \n\n' +
            'dad{@link angular.foo}\n\n' +
            '{@link angular.directive.ng:foo ng:foo}');
        expect(doc.description).
          toBe('<p>foo <a href="#!angular.foo"><code>angular.foo</code></a></p>\n\n' +
               '<p>da <a href="#!angular.foo"><code>bar foo bar</code></a> </p>\n\n' +
               '<p>dad<a href="#!angular.foo"><code>angular.foo</code></a></p>\n\n' +
               '<p><a href="#!angular.directive.ng:foo"><code>ng:foo</code></a></p>');
      });

      it('should increment all headings by one', function() {
        TAG.description(doc, 'description', '# foo\nabc');
        expect(doc.description).
          toBe('<h2>foo</h2>\n\n<p>abc</p>');
      });
    });

    describe('@example', function(){
      it('should not remove {{}}', function(){
        TAG.example(doc, 'example', 'text {{ abc }}');
        expect(doc.example).toEqual('text {{ abc }}');
      });
    });

    describe('@deprecated', function() {
      it('should parse @deprecated', function() {
        TAG.deprecated(doc, 'deprecated', 'Replaced with foo.');
        expect(doc.deprecated).toBe('Replaced with foo.');
      })
    });

    describe('@workInProgress', function() {
      it('should parse @workInProgress without a description and default to true', function() {
        TAG.workInProgress(doc, 'workInProgress', '');
        expect(doc.workInProgress).toEqual({description: ''});
      });

      it('should parse @workInProgress with a description', function() {
        TAG.workInProgress(doc, 'workInProgress', 'my description');
        expect(doc.workInProgress).toEqual({description: '<p>my description</p>'});
      });
    });

  });
  
  describe('trim', function(){
    var trim = collect.trim;
    it('should remove leading/trailing space', function(){
      expect(trim('  \nabc\n  ')).toEqual('abc');
    });
    
    it('should remove leading space on every line', function(){
      expect(trim('\n 1\n  2\n   3\n')).toEqual('1\n 2\n  3');
    });
  });
  
  describe('keywords', function(){
    var keywords = collect.keywords;
    it('should collect keywords', function(){
      expect(keywords('\nHello: World! @ignore.')).toEqual('hello world');
      expect(keywords('The `ng:class-odd` and ')).toEqual('and ng:class-odd the');
    });
  });

});

function load(path){
  var sandbox = {
      require: require,
      console: console,
      __dirname: __dirname,
      testmode: true
  };
  Script.runInNewContext(fs.readFileSync(path), sandbox, path);
  return sandbox;
}
