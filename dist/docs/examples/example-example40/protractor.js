it('should add Hello to the name', function() {
  expect(element(by.binding("greeting")).getText()).toEqual('Bonjour World!');
});