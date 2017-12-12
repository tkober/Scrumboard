import './planning.template.html';
import './planning.controller.js';


angular.module('scrumboard').directive('planning', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/planning/planning.template.html',
    controller: 'PlanningController',
    scope: {
      scrum: '='
    }
  };
});
