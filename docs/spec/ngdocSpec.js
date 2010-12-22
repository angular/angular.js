var ngdoc = require('ngdoc.js');

describe('ngdoc', function(){
  var Doc = ngdoc.Doc;
  describe('Doc', function(){
    describe('metadata', function(){
      
      it('should find keywords', function(){
        expect(new Doc('\nHello: World! @ignore.').keywords()).toEqual('hello world');
        expect(new Doc('The `ng:class-odd` and').keywords()).toEqual('and ng:class-odd the');
      });
    });
    
    describe('parse', function(){
      it('should convert @names into properties', function(){
        var doc = new Doc('\n@name name\n@desc\ndesc\ndesc2\n@dep\n');
        doc.parse();
        expect(doc.name).toEqual('name');
        expect(doc.desc).toEqual('desc\ndesc2');
        expect(doc.dep).toEqual('');
      });
      
      it('should parse parameters', function(){
        var doc = new Doc(
            '@param {*} a short\n' +
            '@param {Type} b med\n' +
            '@param {Class=} [c=2] long\nline');
        doc.parse();
        expect(doc.param).toEqual([
           {name:'a', description:'short', type:'*', optional:false, 'default':undefined},
           {name:'b', description:'med', type:'Type', optional:false, 'default':undefined},
           {name:'c', description:'long\nline', type:'Class', optional:true, 'default':'2'}
         ]);
      });
      
      it('should parse return', function(){
        var doc = new Doc('@returns {Type} text *bold*.');
        doc.parse();
        expect(doc.returns).toEqual({
          type: 'Type',
          description: 'text <em>bold</em>.'
        });
      });
    });
    
    
  });
  
  describe('markdown', function(){
    var markdown = ngdoc.markdown;
    
    it('should replace angular in markdown', function(){
      expect(markdown('<angular/>')).
        toEqual('<p><tt>&lt;angular/&gt;</tt></p>');
    });
    
    it('should not replace anything in <pre>', function(){
      expect(markdown('bah x\n<pre>\nangular.k\n</pre>\n asdf x')).
        toEqual(
            '<p>bah x</p>' +
            '<div ng:non-bindable><pre class="brush: js; html-script: true;">\n' + 
            'angular.k\n' + 
            '</pre></div>' + 
            '<p>asdf x</p>');
    });
    
    it('should replace text between two <pre></pre> tags', function() {
      expect(markdown('<pre>x</pre># One<pre>b</pre>')).
        toMatch('</div><h3>One</h3><div');
    });
  });

  describe('trim', function(){
    var trim = ngdoc.trim;
    it('should remove leading/trailing space', function(){
      expect(trim('  \nabc\n  ')).toEqual('abc');
    });
    
    it('should remove leading space on every line', function(){
      expect(trim('\n 1\n  2\n   3\n')).toEqual('1\n 2\n  3');
    });
  });
  
  describe('merge', function(){
    it('should merge child with parent', function(){
      var parent = new Doc({name:'angular.service.abc'});
      var methodA = new Doc({name:'methodA', methodOf:'angular.service.abc'});
      var methodB = new Doc({name:'methodB', methodOf:'angular.service.abc'});
      var propA = new Doc({name:'propA', propertyOf:'angular.service.abc'});
      var propB = new Doc({name:'propB', propertyOf:'angular.service.abc'});
      ;var docs = [methodB, methodA, propB, propA, parent]; // keep wrong order;
      ngdoc.merge(docs);
      expect(docs.length).toEqual(1);
      expect(docs[0].name).toEqual('angular.service.abc');
      expect(docs[0].methods).toEqual([methodA, methodB]);
      expect(docs[0].properties).toEqual([propA, propB]);
    });
    
  });
  
  ////////////////////////////////////////
  
  describe('TAG', function(){
    describe('@param', function(){
      it('should parse with no default', function(){
        var doc = new Doc('@param {(number|string)} number Number \n to format.');
        doc.parse();
        expect(doc.param).toEqual([{ 
          type : '(number|string)', 
          name : 'number',
          optional: false,
          'default' : undefined, 
          description : 'Number \n to format.' }]);
      });
      
      it('should parse with default and optional', function(){
        var doc = new Doc('@param {(number|string)=} [fractionSize=2] desc');
        doc.parse();
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
        var doc = new Doc('@requires $service\n@requires $another');
        doc.parse();
        expect(doc.requires).toEqual(['$service', '$another']);
      });
    });

    describe('@property', function() {
      it('should parse @property tags into array', function() {
        var doc = new Doc("@property {type} name1 desc\n@property {type} name2 desc");
        doc.parse();
        expect(doc.properties.length).toEqual(2);
      });
      
      it('should parse @property with only name', function() {
        var doc = new Doc("@property fake");
        doc.parse();
        expect(doc.properties[0].name).toEqual('fake');
      });
      
      it('should parse @property with optional type', function() {
        var doc = new Doc("@property {string} name");
        doc.parse();
        expect(doc.properties[0].name).toEqual('name');
        expect(doc.properties[0].type).toEqual('string');
      });
      
      it('should parse @property with optional description', function() {
        var doc = new Doc("@property name desc rip tion");
        doc.parse();
        expect(doc.properties[0].name).toEqual('name');
        expect(doc.properties[0].description).toEqual('desc rip tion');
      });
      
      it('should parse @property with type and description both', function() {
        var doc = new Doc("@property {bool} name desc rip tion");
        doc.parse();
        expect(doc.properties[0].name).toEqual('name');
        expect(doc.properties[0].type).toEqual('bool');
        expect(doc.properties[0].description).toEqual('desc rip tion');
      });
      
    });
    
    describe('@returns', function() {
      it('should not parse @returns without type', function() {
        var doc = new Doc("@returns lala");
        expect(doc.parse).toThrow();
      });
      
      it('should parse @returns with type and description', function() {
        var doc = new Doc("@returns {string} descrip tion");
        doc.parse();
        expect(doc.returns).toEqual({type: 'string', description: 'descrip tion'});
      });

      it('should transform description of @returns with markdown', function() {
        var doc = new Doc("@returns {string} descrip *tion*");
        doc.parse();
        expect(doc.returns).toEqual({type: 'string', description: 'descrip <em>tion</em>'});
      });

      it('should support multiline content', function() {
        var doc = new Doc("@returns {string} description\n new line\n another line");
        doc.parse();
        expect(doc.returns).
          toEqual({type: 'string', description: 'description\n new line\n another line'});
      });
    });
    
    describe('@description', function(){
      it('should support pre blocks', function(){
        var doc = new Doc("@description <pre>abc</pre>");
        doc.parse();
        expect(doc.description).
          toBe('<div ng:non-bindable><pre class="brush: js; html-script: true;">abc</pre></div>');
      });

      it('should support multiple pre blocks', function() {
        var doc = new Doc("@description foo \n<pre>abc</pre>\n#bah\nfoo \n<pre>cba</pre>");
        doc.parse();
        expect(doc.description).
          toBe('<p>foo </p>' +
               '<div ng:non-bindable><pre class="brush: js; html-script: true;">abc</pre></div>' +
               '<h3>bah</h3>\n\n' +
               '<p>foo </p>' +
               '<div ng:non-bindable><pre class="brush: js; html-script: true;">cba</pre></div>');

      });

      it('should support nested @link annotations with or without description', function() {
        var doc = new Doc("@description " +
            'foo {@link angular.foo}\n\n da {@link angular.foo bar foo bar } \n\n' +
            'dad{@link angular.foo}\n\n' +
            '{@link angular.directive.ng:foo ng:foo}');
        doc.parse();
        expect(doc.description).
          toBe('<p>foo <a href="#!angular.foo"><code>angular.foo</code></a></p>\n\n' +
               '<p>da <a href="#!angular.foo"><code>bar foo bar</code></a> </p>\n\n' +
               '<p>dad<a href="#!angular.foo"><code>angular.foo</code></a></p>\n\n' +
               '<p><a href="#!angular.directive.ng:foo"><code>ng:foo</code></a></p>');
      });

      it('should increment all headings by two', function() {
        var doc = new Doc('@description # foo\nabc\n## bar \n xyz');
        doc.parse();
        expect(doc.description).
          toBe('<h3>foo</h3>\n\n<p>abc</p>\n\n<h4>bar</h4>\n\n<p>xyz</p>');
      });
    });

    describe('@example', function(){
      it('should not remove {{}}', function(){
        var doc = new Doc('@example text {{ abc }}');
        doc.parse();
        expect(doc.example).toEqual('text {{ abc }}');
      });
    });

    describe('@deprecated', function() {
      it('should parse @deprecated', function() {
        var doc = new Doc('@deprecated Replaced with foo.');
        doc.parse();
        expect(doc.deprecated).toBe('Replaced with foo.');
      });
    });
  });

});
