var wd = require('wd')
  , assert = require('assert')
  , browser = wd.remote("ondemand.saucelabs.com", 80,
                        process.env.SAUCE_USER_NAME,
                        process.env.SAUCE_ACCESS_KEY)


browser.init({
    browserName:'chrome'
    , tags : ["examples"]
    , name: "This is an example test from Travis"
    , "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER
  }, function() {

  browser.get("http://localhost:8000/build/docs/api", function() {
    browser.title(function(err, title) {
      assert.ok(title.indexOf('AngularJS:'), 'Wrong title!');
      browser.quit();
    });
  });
});
