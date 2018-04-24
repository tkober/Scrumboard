import './history.template.html';
import './history.controller.js';

import '../retired_sprint/retired_sprint.directive.js';


angular.module('scrumboard').directive('history', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/history/history.template.html',
    controller: 'HistoryController',
    scope: {
      scrum: '='
    }
  };
});
