StepsTest = TestCase("StepsTest");

StepsTest.prototype.testGivenDataset=function(){
  var self = {frame:{}, dataset:[]};
  angular.scenario.GIVEN.dataset.call(self);
  assertEquals('$DATASET:{"dataset":[]}', self.frame.name);
};
