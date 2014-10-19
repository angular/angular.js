'use strict';

describe("provider pages", function() {

  it("should show the related service", function() {
    browser.get('build/docs/index.html#!/api/ng/provider/$compileProvider');
    var serviceLink = element.all(by.css('ol.api-profile-header-structure li a')).first();
    expect(serviceLink.getText()).toEqual('- $compile');
    expect(serviceLink.getAttribute('href')).toMatch(/api\/ng\/service\/\$compile/);
  });

});