it('should allow user expression testing', function() {
  element(by.css('.expressions button')).click();
  var lis = element(by.css('.expressions ul')).all(by.repeater('expr in exprs'));
  expect(lis.count()).toBe(1);
  expect(lis.get(0).getText()).toEqual('[ X ] 3*10|currency => $30.00');
});