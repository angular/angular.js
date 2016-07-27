it('should add Hello to the name', function() {
  expect(element(by.binding("'World' | greet")).getText()).toEqual('Hello, World!');
});