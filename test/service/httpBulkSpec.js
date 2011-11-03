'use strict';

describe('httpBulk', function() {
  var scope, httpBulk, $httpBackend;

  beforeEach(function() {
    scope = angular.scope(),
    httpBulk = scope.$service('httpBulk'),
    $httpBackend = scope.$service('$httpBackend');
  });


  describe('receiver', function() {
    it('should set the default receiver url', function() {
      $httpBackend.expect('POST', '/receiver').respond('');
      httpBulk.receiver('/receiver').
               bucket('b1', /.*/);

      httpBulk({method: 'GET', url: '/foo'});
      scope.$digest(); // request
      $httpBackend.flush(); // respond
    });


    it('should allow bucket definition to override receiver url', function() {
      $httpBackend.expect('POST', '/b1Receiver').respond('');
      httpBulk.receiver('/receiver').
               bucket('b1', /.*/, '/b1Receiver');

      httpBulk({method: 'GET', url: '/foo'});
      scope.$digest(); // request
      $httpBackend.flush(); // respond
    });
  });


  describe('bucket', function() {
    it('should allow bucket creation', function() {
      $httpBackend.expect('POST', '/b1Receiver').respond('');
      httpBulk.bucket('b1', /.*/, '/b1Receiver');

      httpBulk({method: 'GET', url: '/foo'});
      scope.$digest(); // request
      $httpBackend.flush(); // respond
    });


    it('should allow multiple bucket creation', function() {
      $httpBackend.expect('POST', '/b1Receiver').respond('');
      $httpBackend.expect('POST', '/b2Receiver').respond('');

      httpBulk.bucket('b1', /\/foo/, '/b1Receiver');
      httpBulk.bucket('b2', /\/bar/, '/b2Receiver');

      httpBulk({method: 'GET', url: '/foo'});
      httpBulk({method: 'GET', url: '/bar'});
      scope.$digest(); // request
      $httpBackend.flush(); // respond
    });
  });


  it('should send requests to correct buckets and passthrough requests not-to-be bullked',
      function() {
    $httpBackend.expect('GET', '/nonbulk').respond('');
    $httpBackend.expect('POST', '/b1Receiver').respond('');
    $httpBackend.expect('POST', '/b2Receiver').respond('');

    httpBulk.bucket('b1', /\/foo\/.*/, '/b1Receiver');
    httpBulk.bucket('b2', /\/bar/, '/b2Receiver');

    httpBulk({method: 'GET', url: '/foo/1'});
    httpBulk({method: 'GET', url: '/bar'});
    httpBulk({method: 'POST', url: '/foo/2'});
    httpBulk({method: 'GET', url: '/foo/3'});
    httpBulk({method: 'GET', url: '/bar'});
    httpBulk({method: 'GET', url: '/nonbulk'});

    scope.$digest(); // request
    $httpBackend.flush(); // respond
  });


  it('should serialize requests in buckets', function() {
    $httpBackend.expect('POST', '/b1Receiver', angular.toJson(
      {"requests":[
        {"method":"GET","url":"/foo/1"},
        {"method":"POST","url":"/foo/2","data":"xxx"},
        {"method":"GET","url":"/foo/3"}
      ]})).respond('');

    $httpBackend.expect('POST', '/b2Receiver', angular.toJson(
      {"requests":[
        {"method":"GET","url":"/bar"},
        {"method":"PUT","url":"/bar","data":"yyy"},
      ]})).respond('');

    httpBulk.bucket('b1', /\/foo\/.*/, '/b1Receiver');
    httpBulk.bucket('b2', /\/bar/, '/b2Receiver');

    httpBulk({method: 'GET', url: '/foo/1'});
    httpBulk({method: 'GET', url: '/bar'});
    httpBulk({method: 'POST', url: '/foo/2', data: 'xxx'});
    httpBulk({method: 'GET', url: '/foo/3'});
    httpBulk({method: 'PUT', url: '/bar', data: 'yyy'});

    scope.$digest(); // request
    $httpBackend.flush(); // respond
  });


  it('should return "on-able" promise and propagate promise resolution to callbacks', function() {
    var log = [];

    function success(body, status) {
      log.push(['s', body.id, status]);
    }

    function error(body, status) {
      log.push(['e', body.error, status]);
    }

    $httpBackend.expect('POST', '/b1Receiver', angular.toJson(
      {"requests":[
        {"method":"GET","url":"/foo/1"},
        {"method":"POST","url":"/foo/2","data":"xxx"},
        {"method":"GET","url":"/foo/3"}
      ]})).respond(angular.toJson([
        {response: {id: '1'}, status: 200},
        {response: {id: '2'}, status: 201},
        {response: {error: 'not found'}, status:404}
      ]));

    httpBulk.bucket('b1', /\/foo\/.*/, '/b1Receiver');

    httpBulk({method: 'GET', url: '/foo/1'}).
      on('success', success).
      on('error', error);

    httpBulk({method: 'POST', url: '/foo/2', data: 'xxx'}).
      on('success', success).
      on('error', error);

    httpBulk({method: 'GET', url: '/foo/3'}).
      on('success', success).
      on('error', error);

    scope.$digest(); // request
    $httpBackend.flush(); // respond

    expect(log).toEqual([
      ['s', '1', 200],
      ['s', '2', 201],
      ['e', 'not found', 404]
    ]);
  });


  it('should clear bucket queues after a flush', function() {
    var log = [];

    function success(body, status) {
      log.push(['s', body.id, status]);
    }

    function error(body, status) {
      log.push(['e', body.error, status]);
    }

    $httpBackend.expect('POST', '/b1Receiver', angular.toJson(
      {"requests":[
        {"method":"GET","url":"/foo/1"},
        {"method":"GET","url":"/foo/3"}
      ]})).respond(angular.toJson([
        {response: {id: '1'}, status: 200},
        {response: {error: 'not found'}, status:404}
      ]));

    httpBulk.bucket('b1', /\/foo\/.*/, '/b1Receiver');

    httpBulk({method: 'GET', url: '/foo/1'}).
      on('success', success).
      on('error', error);

    httpBulk({method: 'GET', url: '/foo/3'}).
      on('success', success).
      on('error', error);

    scope.$digest(); // request
    $httpBackend.flush(); // respond

    expect(log).toEqual([
      ['s', '1', 200],
      ['e', 'not found', 404]
    ]);

    log = [];

    $httpBackend.expect('POST', '/b1Receiver', angular.toJson(
      {"requests":[
        {"method":"GET","url":"/foo/1"},
        {"method":"POST","url":"/foo/2","data":"xxx"}
      ]})).respond(angular.toJson([
        {response: {id: '1'}, status: 200},
        {response: {id: '2'}, status: 201}
      ]));

    httpBulk({method: 'GET', url: '/foo/1'}).
      on('success', success).
      on('error', error);

    httpBulk({method: 'POST', url: '/foo/2', data: 'xxx'}).
      on('success', success).
      on('error', error);

    scope.$digest(); // request
    $httpBackend.flush(); // respond

    expect(log).toEqual([
      ['s', '1', 200],
      ['s', '2', 201]
    ]);
  });


  it('should log and isolate callback errors', function() {
    var log = [];

    function success(body, status) {
      log.push(['s', body.id, status]);
    }

    function error(body, status) {
      log.push(['e', body.error, status]);
    }

    $httpBackend.expect('POST', '/b1Receiver', angular.toJson(
      {"requests":[
        {"method":"GET","url":"/foo/1"},
        {"method":"POST","url":"/foo/2","data":"xxx"},
        {"method":"GET","url":"/foo/3"}
      ]})).respond(angular.toJson([
        {response: {id: '1'}, status: 200},
        {response: {id: '2'}, status: 201},
        {response: {error: 'not found'}, status:404}
      ]));

    httpBulk.bucket('b1', /\/foo\/.*/, '/b1Receiver');

    httpBulk({method: 'GET', url: '/foo/1'}).
      on('success', function() { throw "I'm a misbehaving callback"}).
      on('error', error);

    httpBulk({method: 'POST', url: '/foo/2', data: 'xxx'}).
      on('success', success).
      on('error', error);

    httpBulk({method: 'GET', url: '/foo/3'}).
      on('success', success).
      on('error', error);

    scope.$digest(); // request
    $httpBackend.flush(); // respond

    expect(log).toEqual([
      ['s', '2', 201],
      ['e', 'not found', 404]
    ]);

    expect(scope.$service('$log').error.logs.shift()).toEqual(["I'm a misbehaving callback"]);
  });
});
