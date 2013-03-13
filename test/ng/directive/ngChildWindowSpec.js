'use strict';

describe('ngChildWindow', function () {
    var element;


    afterEach(inject(function ($rootScope) {
        dealoc(element);
        if ($rootScope.childWindow && !$rootScope.childWindow.isClose) {
            $rootScope.childWindow.close();
        }
    }));
    var toggleOpen = function (scope) {
        scope.toggle = true;
        scope.$digest();
    };

    var toggleClose = function (scope) {
        scope.toggle = false;
        scope.$digest();
    };

    beforeEach(inject(function ($rootScope, $compile) {
        element = $compile('<div ng-child-window="\'<h1>{{testValue}}</h1>\'" ng-toggle="toggle"'
            + ' ng-name="childWindow"  ng-init="toggle = false"></div>')($rootScope);
        spyOn(window, 'open').andCallThrough();
        spyOn(window, 'close').andCallThrough();
    }));

    it("should set root.ChildWindow to child-window's window instance",
        inject(function ($rootScope, $window) {

            expect($rootScope.childWindow).toBeUndefined();
            toggleOpen($rootScope);
            expect($rootScope.childWindow).toBeDefined();
        }));

    it("should remain open with the closed property equal to false",
        inject(function ($rootScope, $window) {
            expect($rootScope.childWindow).toBeUndefined();
            toggleOpen($rootScope);
            expect(typeof $rootScope.childWindow.closed === 'boolean').toBeTruthy();
            expect($rootScope.childWindow.closed).toBeFalsy();
        }));

    it("should have called window.open()", inject(function ($rootScope, $window) {
        toggleOpen($rootScope);
        expect(window.open).toHaveBeenCalled();
    }));

    it('should change the value of the toggle property when the child window is closed',
        inject(function ($rootScope) {
            expect($rootScope.toggle).toBeFalsy();
            toggleOpen($rootScope);
            expect($rootScope.toggle).toBeTruthy();
            $rootScope.childWindow.close();
            $rootScope.$digest();
            expect($rootScope.toggle).toBeFalsy();
        }));

    it("should set scope.childWindow to undefined when child window is closed",
        inject(function ($rootScope, $window) {
            toggleOpen($rootScope);
            $rootScope.childWindow.close();
            $rootScope.$digest();
            expect($rootScope.childWindow).toBeUndefined();
        }));

    it('should bind the child window dom to the parent window scope',
        inject(function ($rootScope) {
            $rootScope.testValue = 'HELLOWORLD!';
            toggleOpen($rootScope);
            expect(angular.element($rootScope.childWindow.document.body).find('h1')
                .html() === $rootScope.testValue).toBeTruthy();
        }));

    it('it should update the child window dom when parent model changes',
        inject(function ($rootScope) {
            toggleOpen($rootScope);
            $rootScope.testValue = 'HELLOWORLD!';
            $rootScope.$digest();
            expect(angular.element($rootScope.childWindow.document.body).find('h1')
                .html() === 'HELLOWORLD!').toBeTruthy();
            $rootScope.testValue = "GoodBye!!";
            $rootScope.$digest();
            expect(angular.element($rootScope.childWindow.document.body).find('h1')
                .html() === 'GoodBye!!').toBeTruthy();
        }));


    it('should open and close child window based on toggle value', inject(function ($rootScope) {
        expect($rootScope.toggle).toBeFalsy();
        expect($rootScope.childWindow).toBeUndefined();
        toggleOpen($rootScope);
        expect($rootScope.toggle).toBeTruthy();
        expect($rootScope.childWindow).toBeDefined();
        toggleClose($rootScope);
        expect($rootScope.toggle).toBeFalsy();
        expect($rootScope.childWindow).toBeUndefined();
    }));
});


describe('ngChildWindow', function () {
    var element;


    afterEach(function () {
        dealoc(element);
    });

    var toggleOpen = function (scope) {
        scope.option.toggle = true;
        scope.$digest();
    };

    var toggleClose = function (scope) {
        scope.option.toggle = false;
        scope.$digest();
    };


    beforeEach(inject(function ($rootScope, $compile) {
        $rootScope.option = { toggle: false };
        element = $compile('<div ng-child-window="\'<h1>{{testValue}}</h1>\'"' +
            'ng-toggle="option.toggle" ng-name="childWindow"></div>')($rootScope);
    }));

    it('should toggle the internal toggle property of option to false when closed',
        inject(function ($rootScope) {
            runs(function () {
                expect($rootScope.option.toggle).toBeFalsy();
                toggleOpen($rootScope);
                expect($rootScope.option.toggle).toBeTruthy();
                $rootScope.childWindow.close();
                $rootScope.$digest();
            });
            waits(500);
            runs(function () {
                expect($rootScope.option.toggle).toBeFalsy();
            });
        }));
});


describe('ngChildWindow', function () {
    var element, childWindow;
    afterEach(function () {
        dealoc(element);
    });

    var toggleOpen = function (scope) {
        scope.toggle = true;
        scope.$digest();
    };

    var toggleClose = function (scope) {
        scope.toggle = false;
        scope.$digest();
    };
    beforeEach(inject(function ($rootScope, $compile, $templateCache) {
        $templateCache.put('myUrl.html', [200, '{{name}}', {}]);
        element = $compile('<div ng-child-window="\'myUrl.html\'"' +
            'ng-toggle="toggle" ng-name="childWindow"></div>')($rootScope);
    }));

    it('should include on external file', inject(
    function ($rootScope, $compile) {
        $rootScope.toggle = false;
        $rootScope.name = 'hello World';
        $rootScope.$digest;
        childWindow = $rootScope.childWindow;
        expect($rootScope.childWindow).toBeUndefined();
        toggleOpen($rootScope);
        expect($rootScope.childWindow).toBeDefined();
        expect(angular.element($rootScope.childWindow.document.body).text()).toEqual($rootScope.name);
        toggleClose($rootScope);
        expect($rootScope.childWindow).toBeUndefined();
    }));


});
