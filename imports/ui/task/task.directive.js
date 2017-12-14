import './task.template.html';
import './task.controller.js';


angular.module('scrumboard').directive('task', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/task/task.template.html',
    controller: 'TaskController',
    scope: {
      scrum: '=',
      story: '=',
      task: '=',
      taskStatus: '@',
      index: '='
    }
  };
});
