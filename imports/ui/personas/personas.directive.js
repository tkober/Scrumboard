import './personas.template.html';
import './personas.controller.js';


angular.module('scrumboard').directive('personas', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/personas/personas.template.html',
    controller: 'PersonasController',
    scope: {
      scrum: '='
    }
  };
});
