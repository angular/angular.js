'use strict';

describe('ngDataDirective', function() {
    var element;

    beforeEach(function() {
        module(function($provide) {
            var value;

            $provide.value('ng_data_test_service', {
                setter: function(v) {
                    value = v;
                },
                getter: function() {
                    return value;
                }
            });
        });
    });

    afterEach(function() {
        dealoc(element);
    });


    it('should populate the current scope with contents of a ng-data script element', inject(
        function($rootScope, $compile) {
            element = $compile('<div>foo' +
                '<script type="text/ng-data">{"content": "Some content"}</script>' +
                '</div>')($rootScope);
            expect($rootScope.content).toBe('Some content');
        }
    ));


    it('should populate a given key on the current scope with contents of a ng-data script element', inject(
        function($rootScope, $compile, $injector) {
            element = $compile('<div>foo' +
                '<script type="text/ng-data" data-key="value">{"content": "Some content"}</script>' +
                '</div>')($rootScope);
            expect($rootScope.value.content).toBe('Some content');
        }
    ));


    it('should populate a service with contents of a ng-data script element', inject(
        function($rootScope, $compile, $injector) {
            element = $compile('<div>foo' +
                '<script type="text/ng-data" data-service="ng_data_test_service">{"content": "Some content"}</script>' +
                '</div>')($rootScope);
            expect($injector.get('ng_data_test_service').content).toBe('Some content');
        }
    ));


    it('should populate a given key on a service with contents of a ng-data script element', inject(
        function($rootScope, $compile, $injector) {
            element = $compile('<div>foo' +
                '<script type="text/ng-data" data-service="ng_data_test_service" data-key="value">{"content": "Some content"}</script>' +
                '</div>')($rootScope);
            expect($injector.get('ng_data_test_service').value.content).toBe('Some content');
        }
    ));


    it('should call a menthod on a service with contents of a ng-data script element', inject(
        function($rootScope, $compile, $injector) {
            element = $compile('<div>foo' +
                '<script type="text/ng-data" data-service="ng_data_test_service" data-key="setter">{"content": "Some content"}</script>' +
                '</div>')($rootScope);
            expect($injector.get('ng_data_test_service').getter().content).toBe('Some content');
        }
    ));


    it('should not compile scripts', inject(function($compile, $templateCache, $rootScope) {
        var doc = jqLite('<div></div>');
        // jQuery is too smart and removes script tags
        doc[0].innerHTML = 'foo' +
            '<script type="text/javascript">some {{binding}}</script>' +
            '<script type="text/ng-data">{"content": "Some content"}</script>';

        $compile(doc)($rootScope);
        $rootScope.$digest();

        var scripts = doc.find('script');
        expect(scripts.eq(0)[0].text).toBe('some {{binding}}');
        expect(scripts.eq(1)[0].text).toBe('{"content": "Some content"}');
        dealoc(doc);
    }));
});
