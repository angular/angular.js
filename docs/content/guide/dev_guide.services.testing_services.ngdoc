@ngdoc overview
@name Developer Guide: Angular Services: Testing Angular Services
@description

The following is a unit test for the 'notify' service in the 'Dependencies' example in {@link
dev_guide.services.creating_services Creating Angular Services}. The unit test example uses Jasmine
spy (mock) instead of a real browser alert.

<pre>
var mock, notify;

beforeEach(function() {
  mock = {alert: jasmine.createSpy()};

  module(function($provide) {
    $provide.value('$window', mock);
  });

  inject(function($injector) {
    notify = $injector.get('notify');
  });
});

it('should not alert first two notifications', function() {
  notify('one');
  notify('two');

  expect(mock.alert).not.toHaveBeenCalled();
});

it('should alert all after third notification', function() {
  notify('one');
  notify('two');
  notify('three');

  expect(mock.alert).toHaveBeenCalledWith("one\ntwo\nthree");
});

it('should clear messages after alert', function() {
  notify('one');
  notify('two');
  notify('third');
  notify('more');
  notify('two');
  notify('third');

  expect(mock.alert.callCount).toEqual(2);
  expect(mock.alert.mostRecentCall.args).toEqual(["more\ntwo\nthird"]);
});
</pre>


## Related Topics

* {@link dev_guide.services.understanding_services Understanding Angular Services}
* {@link dev_guide.services.creating_services Creating Angular Services}
* {@link dev_guide.services.managing_dependencies Managing Service Dependencies}
* {@link dev_guide.services.injecting_controllers Injecting Services Into Controllers}

## Related API

* {@link api/ng Angular Service API}
