describe('Inputs', function() {
  it('should be returned by binding', function() {
    browser().navigateTo('Application.html');
    expect(repeater('#repeater div').row(0, ['row.i', 'test', /row\.type/])).toEqual(['1','value text value','text']);
    expect(using('#repeater div:nth-child(1)').binding('row.i')).toEqual(1);
    expect(using('#repeater div:nth-child(1)').binding('test')).toEqual('value text value');
    expect(binding('select-box')).toEqual('B Value');
  });
});


