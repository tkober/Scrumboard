import './retired_sprint.template.html';
import './retired_sprint.controller.js';

import '../burndown_chart/burndown_chart.directive.js';


angular.module('scrumboard').directive('retiredSprint', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/retired_sprint/retired_sprint.template.html',
    controller: 'RetiredSprintController',
    scope: {
      sprint: '='
    }
  };
});
