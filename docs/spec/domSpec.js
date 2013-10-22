var DOM = require('../src/dom.js').DOM;
var normalizeHeaderToId = require('../src/dom.js').normalizeHeaderToId;

describe('dom', function() {
  var dom;

  beforeEach(function() {
    dom = new DOM();
  });

  describe('html', function() {
    it('should add ids to all h tags', function() {
      dom.html('<h1>Some Header</h1>');
      expect(dom.toString()).toContain('<h1 id="some-header">Some Header</h1>');
    });

    it('should collect <a name> anchors too', function() {
      dom.html('<h2>Xxx <a name="foo"></a> and bar <a name="bar"></a>');
      expect(dom.anchors).toContain('foo');
      expect(dom.anchors).toContain('bar');
    })
  });

  it('should collect h tag ids', function() {
    dom.h('Page Title', function() {
      dom.html('<h1>Second</h1>xxx <h2>Third</h2>');
      dom.h('Another Header', function() {});
    });

    expect(dom.anchors).toContain('page-title');
    expect(dom.anchors).toContain('second');
    expect(dom.anchors).toContain('second_third');
    expect(dom.anchors).toContain('another-header');
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
      expect(dom.toString()).toContain('<h2 id="sub-heading">sub-heading</h2>');
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
      expect(dom.toString()).toContain('<h3 id="heading2_heading3">heading3</h3>');

      expect(dom.toString()).toContain('<h1 id="other1">other1</h1>');
      expect(dom.toString()).toContain('<h2 id="other2">other2</h2>');
    });


    it('should add nested ids to all h tags', function() {
      dom.h('Page Title', function() {
        dom.h('Second', function() {
          dom.html('some <h1>Third</h1>');
        });
      });

      var resultingHtml = dom.toString();
      expect(resultingHtml).toContain('<h1 id="page-title">Page Title</h1>');
      expect(resultingHtml).toContain('<h2 id="second">Second</h2>');
      expect(resultingHtml).toContain('<h3 id="second_third">Third</h3>');
    });

  });


  describe('normalizeHeaderToId', function() {
    it('should ignore content in the parenthesis', function() {
      expect(normalizeHeaderToId('One (more)')).toBe('one');
    });

    it('should ignore html content', function() {
      expect(normalizeHeaderToId('Section <a name="section"></a>')).toBe('section');
    });

    it('should ignore special characters', function() {
      expect(normalizeHeaderToId('Section \'!?')).toBe('section');
    });

    it('should ignore html entities', function() {
      expect(normalizeHeaderToId('angular&#39;s-jqlite')).toBe('angulars-jqlite');
    });
  });

});
