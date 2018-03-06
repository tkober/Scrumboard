import '../task/task.directive.js';
import './taskrow.less';
import * as langs from '../../api/languages.js';


angular.module('scrumboard').controller('TaskrowController', ['$scope', function($scope) {

  $scope.createTask = function() {
    $scope.$parent.createTask($scope.story.id);
  };

  $scope.showPersona = function(persona) {
    Meteor.call('scrums.persona.get', $scope.scrum._id, persona, (error, result) => {
      if (!error) {
        $scope.$parent.showPersona(result);
      }
    });
  };

  $scope.personalPronoun_want = function() {
    var l = $scope.getLanguage();
    return $scope.story.personas.length > 1 ? l.we_want : l.i_want;
  };

  $scope.getLanguage = function() {
    for (var i = 0; i < langs.languages.length; i++) {
      var l = langs.languages[i];
      if (l.id == $scope.story.language) {
        return l;
      }
    }
    return langs.EN;
  };

}]);
