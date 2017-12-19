import './retrospective.template.html';
import './retrospective.controller.js';


angular.module('scrumboard').directive('retrospective', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/retrospective/retrospective.template.html',
    controller: 'RetrospectiveController',
    scope: {
      scrum: '='
    }
  };
});
