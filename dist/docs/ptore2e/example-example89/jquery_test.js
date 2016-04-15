describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example89/index-jquery.html");
  });
  
var friends = element.all(by.repeater('friend in friends'));

it('should render initial data set', function() {
  expect(friends.count()).toBe(10);
  expect(friends.get(0).getText()).toEqual('[1] John who is 25 years old.');
  expect(friends.get(1).getText()).toEqual('[2] Jessie who is 30 years old.');
  expect(friends.last().getText()).toEqual('[10] Samantha who is 60 years old.');
  expect(element(by.binding('friends.length')).getText())
      .toMatch("I have 10 friends. They are:");
});

 it('should update repeater when filter predicate changes', function() {
   expect(friends.count()).toBe(10);

   element(by.model('q')).sendKeys('ma');

   expect(friends.count()).toBe(2);
   expect(friends.get(0).getText()).toEqual('[1] Mary who is 28 years old.');
   expect(friends.last().getText()).toEqual('[2] Samantha who is 60 years old.');
 });
});