it('should linkify the snippet with urls', function() {
  expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
      toBe('Pretty text with some links: http://angularjs.org/, us@somewhere.org, ' +
           'another@somewhere.org, and one more: ftp://127.0.0.1/.');
  expect(element.all(by.css('#linky-filter a')).count()).toEqual(4);
});

it('should not linkify snippet without the linky filter', function() {
  expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText()).
      toBe('Pretty text with some links: http://angularjs.org/, mailto:us@somewhere.org, ' +
           'another@somewhere.org, and one more: ftp://127.0.0.1/.');
  expect(element.all(by.css('#escaped-html a')).count()).toEqual(0);
});

it('should update', function() {
  element(by.model('snippet')).clear();
  element(by.model('snippet')).sendKeys('new http://link.');
  expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
      toBe('new http://link.');
  expect(element.all(by.css('#linky-filter a')).count()).toEqual(1);
  expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText())
      .toBe('new http://link.');
});

it('should work with the target property', function() {
 expect(element(by.id('linky-target')).
     element(by.binding("snippetWithSingleURL | linky:'_blank'")).getText()).
     toBe('http://angularjs.org/');
 expect(element(by.css('#linky-target a')).getAttribute('target')).toEqual('_blank');
});

it('should optionally add custom attributes', function() {
 expect(element(by.id('linky-custom-attributes')).
     element(by.binding("snippetWithSingleURL | linky:'_self':{rel: 'nofollow'}")).getText()).
     toBe('http://angularjs.org/');
 expect(element(by.css('#linky-custom-attributes a')).getAttribute('rel')).toEqual('nofollow');
});