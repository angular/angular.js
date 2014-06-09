'use strict';

describe('details', function() {
	var element, $compile, $rootScope;


	beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));


	afterEach(function(){
		dealoc(element);
	});


	it('should not link and hookup an event if ngOpen is not present', function() {
		var jq = jQuery || jqLite;
		element = jq('<details>abc</details>');
		var linker = $compile(element);

		spyOn(jq.prototype, 'on');

		linker($rootScope);

		expect(jq.prototype.on).not.toHaveBeenCalled();
	});

	it('should link and hookup an event if ngOpen is present', function() {
		var jq = jQuery || jqLite;
		element = jq('<details ng-open="open">abc</details>');
		var linker = $compile(element);

		spyOn(jq.prototype, 'on');

		linker($rootScope);

		expect(jq.prototype.on).toHaveBeenCalled();
	});

	it('should not update scope on click if ngOpen is not present', function() {
		$rootScope.$apply(function() {
			$rootScope.open = false;
		});
		element = $compile('<details>abc</details>')($rootScope);
		browserTrigger(element, 'click');
		expect($rootScope.open).toBeFalsy();
	});

	it('should update scope on click if ngOpen is present', function() {
		$rootScope.$apply(function() {
			$rootScope.open = false;
		});
		element = $compile('<details ng-open="open">abc</details>')($rootScope);
		browserTrigger(element, 'click');
		expect($rootScope.open).toBeTruthy();
	});

});