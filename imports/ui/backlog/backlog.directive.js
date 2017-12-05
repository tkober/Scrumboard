import './backlog.template.html';
import './backlog.controller.js';


angular.module('scrumboard').directive('backlog', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/backlog/backlog.template.html',
    controller: 'BacklogController',
    scope: {
      scrum: '='
    }
  };
});
