import './taskrow.template.html';
import './taskrow.controller.js';


angular.module('scrumboard').directive('taskrow', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/taskrow/taskrow.template.html',
    controller: 'TaskrowController',
    scope: {
      scrum: '=',
      story: '=',
      cresteTaskCall: '=',
      epics: '='
    }
  };
});
