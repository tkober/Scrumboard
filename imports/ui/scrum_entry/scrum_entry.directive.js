import './scrum_entry.template.html';
import './scrum_entry.controller.js';


angular.module('scrumboard').directive('scrumEntry', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/scrum_entry/scrum_entry.template.html',
    controller: 'ScrumEntryController',
    scope: {
      scrum: '='
    }
  };
});
