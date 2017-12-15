import './burndown.template.html';
import './burndown.controller.js';
import './burndown.less';


angular.module('scrumboard').directive('burndown', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/burndown/burndown.template.html',
    controller: 'BurndownController',
    scope: {
      scrum: '='
    }
  };
});
