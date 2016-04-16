describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example90/index-jquery.html");
  });
  
it('should show correct pluralized string', function() {
  var withoutOffset = element.all(by.css('ng-pluralize')).get(0);
  var withOffset = element.all(by.css('ng-pluralize')).get(1);
  var countInput = element(by.model('personCount'));

  expect(withoutOffset.getText()).toEqual('1 person is viewing.');
  expect(withOffset.getText()).toEqual('Igor is viewing.');

  countInput.clear();
  countInput.sendKeys('0');

  expect(withoutOffset.getText()).toEqual('Nobody is viewing.');
  expect(withOffset.getText()).toEqual('Nobody is viewing.');

  countInput.clear();
  countInput.sendKeys('2');

  expect(withoutOffset.getText()).toEqual('2 people are viewing.');
  expect(withOffset.getText()).toEqual('Igor and Misko are viewing.');

  countInput.clear();
  countInput.sendKeys('3');

  expect(withoutOffset.getText()).toEqual('3 people are viewing.');
  expect(withOffset.getText()).toEqual('Igor, Misko and one other person are viewing.');

  countInput.clear();
  countInput.sendKeys('4');

  expect(withoutOffset.getText()).toEqual('4 people are viewing.');
  expect(withOffset.getText()).toEqual('Igor, Misko and 2 other people are viewing.');
});
it('should show data-bound names', function() {
  var withOffset = element.all(by.css('ng-pluralize')).get(1);
  var personCount = element(by.model('personCount'));
  var person1 = element(by.model('person1'));
  var person2 = element(by.model('person2'));
  personCount.clear();
  personCount.sendKeys('4');
  person1.clear();
  person1.sendKeys('Di');
  person2.clear();
  person2.sendKeys('Vojta');
  expect(withOffset.getText()).toEqual('Di, Vojta and 2 other people are viewing.');
});
});