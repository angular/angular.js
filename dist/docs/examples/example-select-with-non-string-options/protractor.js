it('should initialize to model', function() {
  var select = element(by.css('select'));
  expect(element(by.model('model.id')).$('option:checked').getText()).toEqual('Two');
});