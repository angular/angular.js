'use strict';

describe('$$forceReflow', function() {
  it('should issue a reflow by touching the `document.body.client` when no param is provided', function() {
    module(function($provide) {
      var doc = jqLite('<div></div>');
      doc[0].body = {};
      doc[0].body.offsetWidth = 10;
      $provide.value('$document', doc);
    });
    inject(function($$forceReflow) {
      var value = $$forceReflow();
      expect(value).toBe(11);
    });
  });

  it('should issue a reflow by touching the `domNode.offsetWidth` when a domNode param is provided',
    inject(function($$forceReflow) {

    var elm = {};
    elm.offsetWidth = 100;
    expect($$forceReflow(elm)).toBe(101);
  }));

  it('should issue a reflow by touching the `jqLiteNode[0].offsetWidth` when a jqLite node param is provided',
    inject(function($$forceReflow) {

    var elm = {};
    elm.offsetWidth = 200;
    elm = jqLite(elm);
    expect($$forceReflow(elm)).toBe(201);
  }));

  describe('$animate with ngAnimateMock', function() {
    beforeEach(module('ngAnimateMock'));

    it('should keep track of how many reflows have been issued',
      inject(function($$forceReflow, $animate) {

      var elm = {};
      elm.offsetWidth = 10;

      expect($animate.reflows).toBe(0);

      $$forceReflow(elm);
      $$forceReflow(elm);
      $$forceReflow(elm);

      expect($animate.reflows).toBe(3);
    }));
  });
});
