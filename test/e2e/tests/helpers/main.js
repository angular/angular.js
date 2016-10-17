'use strict';

var helper = {
  loadFixture: function(fixture) {
    var i = 0;
    while (fixture[i] === '/') ++i;
    fixture = fixture.slice(i);
    if (!/\/(index\.html)?$/.test(fixture)) {
      fixture += '/';
    }

    if (process.env.USE_JQUERY) {
      fixture += '?jquery';
    }

    browser.get('/e2e/fixtures/' + fixture);
    return helper;
  }
};

global.test = helper;
global.loadFixture = helper.loadFixture;
