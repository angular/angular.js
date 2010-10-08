describe('widgets', function() {
  it('should verify that basic widgets work', function(){
    navigateTo('widgets.html');
    input('text.basic').enter('Carlos');
    expect(binding('text.basic')).toEqual('Carlos');
    pause(2);
    input('text.basic').enter('Carlos Santana');
    pause(2);
    expect(binding('text.basic')).not().toEqual('Carlos Boozer');
    pause(2);
    input('text.password').enter('secret');
    expect(binding('text.password')).toEqual('secret');
    expect(binding('text.hidden')).toEqual('hiddenValue');
    expect(binding('gender')).toEqual('male');
    pause(2);
    input('gender').select('female');
    expect(binding('gender')).toEqual('female');
    pause(2);
  });
  describe('do it again', function() {
    it('should verify that basic widgets work', function(){
      navigateTo('widgets.html');
      input('text.basic').enter('Carlos');
      expect(binding('text.basic')).toEqual('Carlos');
      pause(2);
      input('text.basic').enter('Carlos Santana');
      pause(2);
      expect(binding('text.basic')).toEqual('Carlos Santana');
      pause(2);
      input('text.password').enter('secret');
      expect(binding('text.password')).toEqual('secret');
      expect(binding('text.hidden')).toEqual('hiddenValue');
      expect(binding('gender')).toEqual('male');
      pause(2);
      input('gender').select('female');
      expect(binding('gender')).toEqual('female');
      pause(2);
    });
  });
  it('should verify that basic widgets work', function(){
    navigateTo('widgets.html');
    input('text.basic').enter('Carlos');
    expect(binding('text.basic')).toEqual('Carlos');
    pause(2);
    input('text.basic').enter('Carlos Santana');
    pause(2);
    expect(binding('text.basic')).toEqual('Carlos Santana');
    pause(2);
    input('text.password').enter('secret');
    expect(binding('text.password')).toEqual('secret');
    expect(binding('text.hidden')).toEqual('hiddenValue');
    expect(binding('gender')).toEqual('male');
    pause(2);
    input('gender').select('female');
    expect(binding('gender')).toEqual('female');
    pause(2);
  });
});
