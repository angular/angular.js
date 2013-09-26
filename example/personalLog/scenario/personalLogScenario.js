describe('personal log', function() {

  beforeEach(function() {
    browser().navigateTo('../personalLog.html');
  });


  afterEach(function() {
    clearCookies();
  });


  it('should create new logs and order them in reverse chronological order', function() {
    //create first msg
    input('newMsg').enter('my first message');
    element('form input[type="submit"]').click();

    expect(repeater('ul li').count()).toEqual(1);
    expect(repeater('ul li').column('log.msg')).toEqual(['my first message']);

    //create second msg
    input('newMsg').enter('my second message');
    element('form input[type="submit"]').click();

    expect(repeater('ul li').count()).toEqual(2);
    expect(repeater('ul li').column('log.msg')).toEqual(['my second message', 'my first message']);
  });


  it('should delete a log when user clicks on the related X link', function() {
    //create first msg
    input('newMsg').enter('my first message');
    element('form input[type="submit"]').click();
    //create second msg
    input('newMsg').enter('my second message');
    element('form input[type="submit"]').click();
    expect(repeater('ul li').count()).toEqual(2);

    element('ul li a:eq(1)').click();
    expect(repeater('ul li').count()).toEqual(1);
    expect(repeater('ul li').column('log.msg')).toEqual(['my second message']);

    element('ul li a:eq(0)').click();
    expect(repeater('ul li').count()).toEqual(0);
  });


  it('should delete all cookies when user clicks on "remove all" button', function() {
    //create first msg
    input('newMsg').enter('my first message');
    element('form input[type="submit"]').click();
    //create second msg
    input('newMsg').enter('my second message');
    element('form input[type="submit"]').click();
    expect(repeater('ul li').count()).toEqual(2);

    element('input[value="remove all"]').click();
    expect(repeater('ul li').count()).toEqual(0);
  });


  it('should preserve logs over page reloads', function() {
    input('newMsg').enter('my persistent message');
    element('form input[type="submit"]').click();
    expect(repeater('ul li').count()).toEqual(1);

    browser().reload();

    expect(repeater('ul li').column('log.msg')).toEqual(['my persistent message']);
    expect(repeater('ul li').count()).toEqual(1);
  });
});


/**
 * DSL for deleting all cookies.
 */
angular.scenario.dsl('clearCookies', function() {
  /**
   * Deletes cookies by interacting with the cookie service within the application under test.
   */
  return function() {
    this.addFutureAction('clear all cookies', function($window, $document, done) {
      var element = $window.angular.element($document[0]),
          rootScope = element.scope(),
          $cookies = element.data('$injector')('$cookies'),
          cookieName;

      rootScope.$apply(function() {
        for (cookieName in $cookies) {
          delete $cookies[cookieName];
        }
      });

      done();
    });
  };
});
