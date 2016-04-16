(function(angular) {
  'use strict';
function EditableFieldController($scope, $element, $attrs) {
  var ctrl = this;
  ctrl.editMode = false;

  ctrl.handleModeChange = function() {
    if (ctrl.editMode) {
      ctrl.onUpdate({value: ctrl.fieldValue});
      ctrl.fieldValueCopy = ctrl.fieldValue;
    }
    ctrl.editMode = !ctrl.editMode;
  };

  ctrl.reset = function() {
    ctrl.fieldValue = ctrl.fieldValueCopy;
  };

  ctrl.$onInit = function() {
    // Make a copy of the initial value to be able to reset it later
    ctrl.fieldValueCopy = ctrl.fieldValue;

    // Set a default fieldType
    if (!ctrl.fieldType) {
      ctrl.fieldType = 'text';
    }
  };
}

angular.module('heroApp').component('editableField', {
  templateUrl: 'editableField.html',
  controller: EditableFieldController,
  bindings: {
    fieldValue: '<',
    fieldType: '@?',
    onUpdate: '&'
  }
});
})(window.angular);