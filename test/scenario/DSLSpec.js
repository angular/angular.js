describe("DSL", function() {

  var lastDocument, executeFuture, Expect;

  beforeEach(function() {
    setUpContext();
    executeFuture = function(future, html, callback) {
      lastDocument = _jQuery('<div>' + html + '</div>');
      _jQuery(document.body).append(lastDocument);
      var specThis = {
        testWindow: window,
        testDocument: lastDocument,
        jQuery: _jQuery
      };
      future.behavior.call(specThis, callback || noop);
    };
    Expect = _window.expect;
  });

  describe("input", function() {

    var input = angular.scenario.dsl.input;

    it('should enter', function() {
      var future = input('name').enter('John');
      expect(future.name).toEqual("input 'name' enter 'John'");
      executeFuture(future, '<input type="text" name="name" />');
      expect(lastDocument.find('input').val()).toEqual('John');
    });

    it('should select', function() {
      var future = input('gender').select('female');
      expect(future.name).toEqual("input 'gender' select 'female'");
      executeFuture(future,
        '<input type="radio" name="0@gender" value="male" checked/>' +
        '<input type="radio" name="0@gender" value="female"/>');
      expect(lastDocument.find(':radio:checked').length).toEqual(1);
      expect(lastDocument.find(':radio:checked').val()).toEqual('female');
    });
  });

  describe('repeater', function() {

    var repeater = angular.scenario.dsl.repeater;
    var html;
    beforeEach(function() {
      html = "<table>" +
          "<tr class='epic'>" +
            "<td class='hero-name'>" +
              "<span ng:bind='hero'>John Marston</span>" +
            "</td>" +
            "<td class='game-name'>" +
              "<span ng:bind='game'>Red Dead Redemption</span>" +
            "</td>" +
          "</tr>" +
          "<tr class='epic'>" +
            "<td class='hero-name'>" +
              "<span ng:bind='hero'>Nathan Drake</span>" +
            "</td>" +
            "<td class='game-name'>" +
              "<span ng:bind='game'>Uncharted</span>" +
            "</td>" +
          "</tr>" +
        "</table>";
    });
    it('should count', function() {
      var future = repeater('.repeater-row').count();
      expect(future.name).toEqual("repeater '.repeater-row' count");
      executeFuture(future,
        "<div class='repeater-row'>a</div>" +
        "<div class='repeater-row'>b</div>",
        function(value) {
          future.fulfill(value);
      });
      expect(future.fulfilled).toBeTruthy();
      expect(future.value).toEqual(2);
    });

    function assertFutureState(future, expectedName, expectedValue) {
      expect(future.name).toEqual(expectedName);
      executeFuture(future, html, function(value) {
        future.fulfill(value);
      });
      expect(future.fulfilled).toBeTruthy();
      expect(future.value).toEqual(expectedValue);
    }
    it('should collect bindings', function() {
      assertFutureState(repeater('.epic').collect('{{hero}}'),
        "repeater '.epic' collect '{{hero}}'",
        ['John Marston', 'Nathan Drake']);
      assertFutureState(repeater('.epic').collect('{{game}}'),
        "repeater '.epic' collect '{{game}}'",
        ['Red Dead Redemption', 'Uncharted']);
    });
    it('should collect normal selectors', function() {
      assertFutureState(repeater('.epic').collect('.hero-name'),
        "repeater '.epic' collect '.hero-name'",
        ['John Marston', 'Nathan Drake']);
      assertFutureState(repeater('.epic').collect('.game-name'),
        "repeater '.epic' collect '.game-name'",
        ['Red Dead Redemption', 'Uncharted']);
    });
    it('should collect normal attributes', function() {});
  });

  describe('element', function() {
    var element = angular.scenario.dsl.element;
    var html;
    beforeEach(function() {
      html = '<div class="container">' +
          '<div class="reports-detail">' +
            '<span class="desc">Description : ' +
              '<span ng:bind="report.description">Details...</span>' +
            '</span>' +
            '<span>Date created: ' +
              '<span ng:bind="report.creationDate">01/01/01</span>' +
            '</span>' +
          '</div>' +
        '</div>';
    });
    it('should find elements on the page and provide jquery api', function() {
      var future = element('.reports-detail');
      expect(future.name).toEqual("Find element '.reports-detail'");
      executeFuture(future, html, function(value) { future.fulfill(value); });
      expect(future.fulfilled).toBeTruthy();
      expect(future.value.text()).
        toEqual('Description : Details...Date created: 01/01/01');
      expect(future.value.find('.desc').text()).
        toEqual('Description : Details...');
    });
    it('should know how to find ng:bind elements on page', function() {
      var future = element('.reports-detail');
      expect(future.name).toEqual("Find element '.reports-detail'");
      executeFuture(future, html, function(value) { future.fulfill(value); });
      expect(future.fulfilled).toBeTruthy();
      expect(future.value.boundTo('report.description')).toEqual('Details...');
      expect(future.value.boundTo('report.creationDate')).toEqual('01/01/01');
      expect(future.value.boundTo('doesnotexist')).not.toBeDefined();
    });
  });
});
