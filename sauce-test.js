var webdriver = require('selenium-webdriver');
var assert = require('assert');

var browser = new webdriver.Builder().
                  usingServer('http://ondemand.saucelabs.com:80/wd/hub').
                  withCapabilities({
                    'username'         : process.env.SAUCE_USERNAME,
                    'accessKey'        : process.env.SAUCE_ACCESS_KEY.split("").reverse().join(""),
                    'browserName'      : 'chrome',
                    'tags'             : ["examples"],
                    'name'             : "This is an example test from Travis + webdriver.js",
                    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
                  }).
                  build();

browser.get("http://localhost:8000/build/docs/api");
browser.getTitle().then(function(title) {
  assert.equal("AngularJS: API Reference", title);
});

browser.get("http://localhost:8000/build/docs/guide");
browser.getTitle().then(function(title) {
  assert.equal("AngularJS: Developer Guide", title);
});

browser.quit();
