import './persona_entry.template.html';
import './persona_entry.controller.js';


angular.module('scrumboard').directive('personaEntry', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/persona_entry/persona_entry.template.html',
    controller: 'PersonaEntryController',
    scope: {
      persona: '=',
      scrum: '='
    }
  };
});
