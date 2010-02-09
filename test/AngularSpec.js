describe('Angular', function(){
  it('should fire on updateEvents', function(){
    var onUpdateView = jasmine.createSpy();
    var scope = angular.compile("<div></div>", { onUpdateView: onUpdateView });
    expect(onUpdateView).wasNotCalled();
    scope.init();
    scope.updateView();
    expect(onUpdateView).wasCalled();
  });
});