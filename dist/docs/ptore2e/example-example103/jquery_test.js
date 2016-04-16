describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example103/index-jquery.html");
  });
  
var numLimitInput = element(by.model('numLimit'));
var letterLimitInput = element(by.model('letterLimit'));
var longNumberLimitInput = element(by.model('longNumberLimit'));
var limitedNumbers = element(by.binding('numbers | limitTo:numLimit'));
var limitedLetters = element(by.binding('letters | limitTo:letterLimit'));
var limitedLongNumber = element(by.binding('longNumber | limitTo:longNumberLimit'));

it('should limit the number array to first three items', function() {
  expect(numLimitInput.getAttribute('value')).toBe('3');
  expect(letterLimitInput.getAttribute('value')).toBe('3');
  expect(longNumberLimitInput.getAttribute('value')).toBe('3');
  expect(limitedNumbers.getText()).toEqual('Output numbers: [1,2,3]');
  expect(limitedLetters.getText()).toEqual('Output letters: abc');
  expect(limitedLongNumber.getText()).toEqual('Output long number: 234');
});

// There is a bug in safari and protractor that doesn't like the minus key
// it('should update the output when -3 is entered', function() {
//   numLimitInput.clear();
//   numLimitInput.sendKeys('-3');
//   letterLimitInput.clear();
//   letterLimitInput.sendKeys('-3');
//   longNumberLimitInput.clear();
//   longNumberLimitInput.sendKeys('-3');
//   expect(limitedNumbers.getText()).toEqual('Output numbers: [7,8,9]');
//   expect(limitedLetters.getText()).toEqual('Output letters: ghi');
//   expect(limitedLongNumber.getText()).toEqual('Output long number: 342');
// });

it('should not exceed the maximum size of input array', function() {
  numLimitInput.clear();
  numLimitInput.sendKeys('100');
  letterLimitInput.clear();
  letterLimitInput.sendKeys('100');
  longNumberLimitInput.clear();
  longNumberLimitInput.sendKeys('100');
  expect(limitedNumbers.getText()).toEqual('Output numbers: [1,2,3,4,5,6,7,8,9]');
  expect(limitedLetters.getText()).toEqual('Output letters: abcdefghi');
  expect(limitedLongNumber.getText()).toEqual('Output long number: 2345432342');
});
});