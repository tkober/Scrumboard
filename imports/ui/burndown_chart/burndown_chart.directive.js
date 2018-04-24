import './burndown_chart.template.html';
import './burndown_chart.controller.js';
import './burndown_chart.less';


angular.module('scrumboard').directive('burndownChart', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/burndown_chart/burndown_chart.template.html',
    controller: 'BurndownChartController',
    scope: {
      sprint: '='
    }
  };
});
