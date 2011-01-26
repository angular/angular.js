var DOM = require('dom.js').DOM;

describe('dom', function(){
  var dom;

  beforeEach(function(){
    dom = new DOM();
  });

  describe('example', function(){
    it('should render code, live, test', function(){
      dom.example('desc', 'src', 'scenario');
      expect(dom.toString()).toEqual(
          '<h1>Example</h1>\n' +
          '<div class="example">' +
          'desc<doc:example><doc:source>src</doc:source>\n' +
          '<doc:scenario>scenario</doc:scenario>\n'+
          '</doc:example>\n' +
          '</div>\n');
    });

    it('should render non-live, test with description', function(){
      dom.example('desc', 'src', false);
      expect(dom.toString()).toEqual('<h1>Example</h1>\n' +
          '<div class="example">' +
          'desc<div ng:non-bindable="">' +
          '<pre class="brush: js; html-script: true;">src</pre>\n' +
          '</div>\n' +
          '</div>\n');
    });

    it('should render non-live, test', function(){
      dom.example('desc', 'src', false);
      expect(dom.toString()).toContain('<pre class="brush: js; html-script: true;">src</pre>');
    });
  });

  describe('h', function(){

    it('should render using function', function(){
      var cbThis;
      var cdValue;
      dom.h('heading', 'content', function(value){
        cbThis = this;
        cbValue = value;
      });
      expect(cbThis).toEqual(dom);
      expect(cbValue).toEqual('content');
    });

    it('should update heading numbers', function(){
      dom.h('heading', function(){
        this.html('<h1>sub-heading</h1>');
      });
      expect(dom.toString()).toContain('<h1>heading</h1>');
      expect(dom.toString()).toContain('<h2>sub-heading</h2>');
    });

  });

});
