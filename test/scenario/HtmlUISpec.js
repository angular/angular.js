describe('angular.scenario.HtmlUI', function() {
  var ui;
  var context;
  var spec;
  
  beforeEach(function() {
    spec = {
      name: 'test spec',
      definition: {
        id: 10,
        name: 'child',
        children: [],
        parent: {
          id: 20,
          name: 'parent',
          children: []
        }
      }
    };
    context = _jQuery("<div></div>");
    ui = new angular.scenario.ui.Html(context);
  });
  
  it('should create nested describe context', function() {
    ui.addSpec(spec);
    expect(context.find('#describe-20 #describe-10 > h2').text())
      .toEqual('describe: child');
    expect(context.find('#describe-20 > h2').text()).toEqual('describe: parent');
    expect(context.find('#describe-10 .tests > li .test-info .test-name').text())
      .toEqual('it test spec');
    expect(context.find('#describe-10 .tests > li').hasClass('status-pending'))
      .toBeTruthy();
  });
  
  it('should update totals when steps complete', function() {
    // Error
    ui.addSpec(spec).error('error');
    // Error
    specUI = ui.addSpec(spec);
    specUI.addStep('some step').finish();
    specUI.finish('error');
    // Failure
    specUI = ui.addSpec(spec);
    specUI.addStep('some step').finish('failure');
    specUI.finish('failure');
    // Failure
    specUI = ui.addSpec(spec);
    specUI.addStep('some step').finish('failure');
    specUI.finish('failure');
    // Failure
    specUI = ui.addSpec(spec);
    specUI.addStep('some step').finish('failure');
    specUI.finish('failure');
    // Success
    specUI = ui.addSpec(spec);
    specUI.addStep('some step').finish();
    specUI.finish();
    
    expect(parseInt(context.find('#status-legend .status-failure').text()))
      .toEqual(3);
    expect(parseInt(context.find('#status-legend .status-error').text()))
      .toEqual(2);
    expect(parseInt(context.find('#status-legend .status-success').text()))
      .toEqual(1);
  });
  
  it('should update timer when test completes', function() {
    // Success
    specUI = ui.addSpec(spec);
    specUI.addStep('some step').finish();
    specUI.finish();
    
    // Failure
    specUI = ui.addSpec(spec);
    specUI.addStep('some step').finish('failure');
    specUI.finish('failure');
    
    // Error
    specUI = ui.addSpec(spec).error('error');
    
    context.find('#describe-10 .tests > li .test-info .timer-result')
      .each(function(index, timer) {
        expect(timer.innerHTML).toMatch(/ms$/);
    });
  });

});
