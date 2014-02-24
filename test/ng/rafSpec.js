'use strict';

describe('$$rAF', function() {
  it('should queue and block animation frames', inject(function($$rAF) {
    if(!$$rAF.supported) return;

    var message;
    $$rAF(function() {
      message = 'yes';
    });

    expect(message).toBeUndefined();
    $$rAF.flush();
    expect(message).toBe('yes');
  }));

  it('should provide a cancellation method', inject(function($$rAF) {
    if(!$$rAF.supported) return;

    var present = true;
    var cancel = $$rAF(function() {
      present = false;
    });

    expect(present).toBe(true);
    cancel();

    try {
      $$rAF.flush();
    } catch(e) {};
    expect(present).toBe(true);
  }));

  describe('mocks', function() {
    it('should throw an error if no frames are present', inject(function($$rAF) {
      if($$rAF.supported) {
        var failed = false;
        try {
          $$rAF.flush();
        } catch(e) {
          failed = true;
        }
        expect(failed).toBe(true);
      }
    }));
  });
});
