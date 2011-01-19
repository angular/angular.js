var DOM = require('dom.js').DOM;

describe('dom', function(){
  describe('example', function(){
    it('should render code, live, test', function(){
      var dom = new DOM();
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
      var dom = new DOM();
      dom.example('desc', 'src', false);
      expect(dom.toString()).toEqual('<h1>Example</h1>\n' +
          '<div class="example">' +
          'desc<div ng:non-bindable="">' +
          '<pre class="brush: js; html-script: true;">src</pre>\n' +
          '</div>\n' +
          '</div>\n');
    });

    it('should render non-live, test', function(){
      var dom = new DOM();
      dom.example('desc', 'src', false);
      expect(dom.toString()).toContain('<pre class="brush: js; html-script: true;">src</pre>');
    });

  });
});
