'use strict';
describe('$$asyncCallback', function() {
  it('should perform a callback asynchronously', inject(function($$asyncCallback) {
    var message = 'hello there ';
    $$asyncCallback(function() {
      message += 'Angular';
    });

    expect(message).toBe('hello there ');
    $$asyncCallback.flush();
    expect(message).toBe('hello there Angular');
  }));

  describe('mocks', function() {
    it('should queue up all async callbacks', inject(function($$asyncCallback) {
      var callback = jasmine.createSpy('callback');
      $$asyncCallback(callback);
      $$asyncCallback(callback);
      $$asyncCallback(callback);
      expect(callback.callCount).toBe(0);

      $$asyncCallback.flush();
      expect(callback.callCount).toBe(3);

      $$asyncCallback(callback);
      $$asyncCallback(callback);
      expect(callback.callCount).toBe(3);

      $$asyncCallback.flush();
      expect(callback.callCount).toBe(5);
    }));
  });
});
