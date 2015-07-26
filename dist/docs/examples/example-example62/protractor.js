var ps = element.all(by.css('p'));

it('should let you toggle the class', function() {

  expect(ps.first().getAttribute('class')).not.toMatch(/bold/);
  expect(ps.first().getAttribute('class')).not.toMatch(/red/);

  element(by.model('important')).click();
  expect(ps.first().getAttribute('class')).toMatch(/bold/);

  element(by.model('error')).click();
  expect(ps.first().getAttribute('class')).toMatch(/red/);
});

it('should let you toggle string example', function() {
  expect(ps.get(1).getAttribute('class')).toBe('');
  element(by.model('style')).clear();
  element(by.model('style')).sendKeys('red');
  expect(ps.get(1).getAttribute('class')).toBe('red');
});

it('array example should have 3 classes', function() {
  expect(ps.last().getAttribute('class')).toBe('');
  element(by.model('style1')).sendKeys('bold');
  element(by.model('style2')).sendKeys('strike');
  element(by.model('style3')).sendKeys('red');
  expect(ps.last().getAttribute('class')).toBe('bold strike red');
});