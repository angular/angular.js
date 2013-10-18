var DOM = require('../src/dom.js').DOM;

describe('dom', function() {
  var dom;

  beforeEach(function() {
    dom = new DOM();
  });

  describe('h', function() {

    it('should render using function', function() {
      var cbThis;
      var cdValue;
      dom.h('heading', 'content', function(value){
        cbThis = this;
        cbValue = value;
      });
      expect(cbThis).toEqual(dom);
      expect(cbValue).toEqual('content');
    });

    it('should update heading numbers', function() {
      dom.h('heading', function() {
        this.html('<h1>sub-heading</h1>');
      });
      expect(dom.toString()).toContain('<h1 id="heading">heading</h1>');
      expect(dom.toString()).toContain('<h2>sub-heading</h2>');
    });

    it('should properly number nested headings', function() {
      dom.h('heading', function() {
        dom.h('heading2', function() {
          this.html('<h1>heading3</h1>');
        });
      });
      dom.h('other1', function() {
        this.html('<h1>other2</h1>');
      });

      expect(dom.toString()).toContain('<h1 id="heading">heading</h1>');
      expect(dom.toString()).toContain('<h2 id="heading2">heading2</h2>');
      expect(dom.toString()).toContain('<h3>heading3</h3>');

      expect(dom.toString()).toContain('<h1 id="other1">other1</h1>');
      expect(dom.toString()).toContain('<h2>other2</h2>');
    });

  });

});
