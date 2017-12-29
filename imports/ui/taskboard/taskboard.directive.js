import './taskboard.template.html';
import './taskboard.controller.js';


angular.module('scrumboard').directive('taskboard', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/taskboard/taskboard.template.html',
    controller: 'TaskboardController',
    scope: {
      scrum: '=',
      cresteTaskCall: '='
    }
  };
});
