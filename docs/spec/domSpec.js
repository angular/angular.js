var DOM = require('dom.js').DOM;

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
      expect(dom.toString()).toContain('<h1>heading</h1>');
      expect(dom.toString()).toContain('<h2>sub-heading</h2>');
    });

  });

});
