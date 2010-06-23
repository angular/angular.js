describe('widgets', function(){
  it('should verify that basic widgets work', function(){
    browser.navigateTo('widgets.html');

    expect('{{text.basic}}').toEqual('');
    input('text.basic').enter('John');
    expect('{{text.basic}}').toEqual('John');

    expect('{{text.password}}').toEqual('');
    input('text.password').enter('secret');
    expect('{{text.password}}').toEqual('secret');

    expect('{{text.hidden}}').toEqual('hiddenValue');

    expect('{{gender}}').toEqual('male');
    input('gender').select('female');
    input('gender').isChecked('female');
    expect('{{gender}}').toEqual('female');

//    expect('{{tea}}').toBeChecked();
//    input('gender').select('female');
//    expect('{{gender}}').toEqual('female');

  });
});
