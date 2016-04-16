describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-ngControllerAs/index.html");
  });
  
it('should check controller as', function() {
  var container = element(by.id('ctrl-as-exmpl'));
    expect(container.element(by.model('settings.name'))
      .getAttribute('value')).toBe('John Smith');

  var firstRepeat =
      container.element(by.repeater('contact in settings.contacts').row(0));
  var secondRepeat =
      container.element(by.repeater('contact in settings.contacts').row(1));

  expect(firstRepeat.element(by.model('contact.value')).getAttribute('value'))
      .toBe('408 555 1212');

  expect(secondRepeat.element(by.model('contact.value')).getAttribute('value'))
      .toBe('john.smith@example.org');

  firstRepeat.element(by.buttonText('clear')).click();

  expect(firstRepeat.element(by.model('contact.value')).getAttribute('value'))
      .toBe('');

  container.element(by.buttonText('add')).click();

  expect(container.element(by.repeater('contact in settings.contacts').row(2))
      .element(by.model('contact.value'))
      .getAttribute('value'))
      .toBe('yourname@example.org');
});
});