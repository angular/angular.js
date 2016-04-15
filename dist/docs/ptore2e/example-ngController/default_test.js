describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-ngController/index.html");
  });
  
it('should check controller', function() {
  var container = element(by.id('ctrl-exmpl'));

  expect(container.element(by.model('name'))
      .getAttribute('value')).toBe('John Smith');

  var firstRepeat =
      container.element(by.repeater('contact in contacts').row(0));
  var secondRepeat =
      container.element(by.repeater('contact in contacts').row(1));

  expect(firstRepeat.element(by.model('contact.value')).getAttribute('value'))
      .toBe('408 555 1212');
  expect(secondRepeat.element(by.model('contact.value')).getAttribute('value'))
      .toBe('john.smith@example.org');

  firstRepeat.element(by.linkText('clear')).click();

  expect(firstRepeat.element(by.model('contact.value')).getAttribute('value'))
      .toBe('');

  container.element(by.linkText('add')).click();

  expect(container.element(by.repeater('contact in contacts').row(2))
      .element(by.model('contact.value'))
      .getAttribute('value'))
      .toBe('yourname@example.org');
});
});