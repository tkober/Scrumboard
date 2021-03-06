import './edit_user_story.less';
import * as langs from '../../api/languages.js';


angular.module('scrumboard').controller('EditUserStoryController', ['$scope', '$location', '$stateParams', '$reactive', '$timeout', function($scope, $location, $stateParams, $reactive, $timeout) {
  $reactive(this).attach($scope);

  $scope.storyToEdit = $stateParams.storyId;
  $scope.languages = langs.languages;

  $scope.error = null;
  $scope.personas = [];
  $scope.goal = null;
  $scope.reason = null;
  $scope.newAC = null;
  $scope.epic = null;
  $scope.intranet = null;
  $scope.redmine = null;
  $scope.acceptanceCriteria = [];
  $scope.language = langs.EN.id;

  Meteor.call('scrums.personas.get', $stateParams.scrumId, (error, result) => {
    $scope.error = error;
    if (!error) {
      $scope.availablePersonas = result;
      $scope.$apply();
    }
  });

  if ($scope.storyToEdit) {
    this.call('scrums.userstories.get', $stateParams.scrumId, $scope.storyToEdit, (error, result) => {
      $scope.error = error;
      if (!error) {
        $scope.epic = result.epic;
        $scope.personas = result.personas;
        $scope.goal = result.goal;
        $scope.reason = result.reason;
        $scope.acceptanceCriteria = result.acceptanceCriteria;
        $scope.intranet = result.intranet;
        $scope.redmine = result.redmine;
        if (result.language) {
          $scope.language = result.language;
        }
      }
    });
  }

  $scope.save = function() {
    if ($scope.storyToEdit) {
      // Update existing
      Meteor.call('scrums.userstories.update', $scope.storyToEdit,
      $scope.epic,
      angular.toJson($scope.personas),
      angular.toJson($scope.acceptanceCriteria),
      $scope.goal,
      $scope.reason,
      $stateParams.scrumId,
      $scope.intranet,
      $scope.redmine,
      $scope.language, (error, result) => {
        if (error) {
          $scope.error = error;
        } else {
          $scope.cancel();
        }
        $scope.$apply();
      });
    } else {
      // Create new
      Meteor.call('scrums.userstories.create', $scope.epic,
      angular.toJson($scope.personas),
      angular.toJson($scope.acceptanceCriteria),
      $scope.goal,
      $scope.reason,
      $stateParams.scrumId,
      $scope.intranet,
      $scope.redmine,
      $scope.language, (error, result) => {
        if (error) {
          $scope.error = error;
        } else {
          $scope.cancel();
        }
        $scope.$apply();
      });
    }
  };

  $scope.addPersona = function(persona) {
    for (var i = 0; i < $scope.personas.length; i++) {
      p = $scope.personas[i];
      if (p.id === persona.name) {
        return;
      }
    }
    $scope.personas.push({ title: persona.name, id: persona.name });
  };

  $scope.removePersona = function(persona) {
    var index = $scope.personas.indexOf(persona);
    if (index > -1) {
      $scope.personas.splice(index, 1);
    }
  };

  $scope.cancel = function() {
    $location.path('/scrums/' + $stateParams.scrumId);
  };

  $scope.isValid = function() {
    return $scope.personas.length > 0 &&
      $scope.acceptanceCriteria.length > 0 &&

      $scope.goal != null &&
      $scope.goal.length > 0 &&

      $scope.reason != null &&
      $scope.reason.length > 0 &&

      $scope.epic != null &&
      $scope.epic.length > 0;
  };

  $scope.isValidAC = function() {
    return $scope.newAC != null &&
      $scope.newAC.length > 0
  };

  $scope.addNewAC = function() {
    if ($scope.acceptanceCriteria.indexOf($scope.newAC) == -1) {
      $scope.acceptanceCriteria.push($scope.newAC);
    }
    $scope.newAC = null;
  };

  $scope.removeAC = function(ac) {
    var index = $scope.acceptanceCriteria.indexOf(ac);
    if (index > -1) {
      $scope.acceptanceCriteria.splice(index, 1);
    }
  }

  $scope.email = function() {
    return Meteor.user().emails[0].address;
  };

  $scope.getLanguage = function() {
    for (var i = 0; i < langs.languages.length; i++) {
      var l = langs.languages[i];
      if (l.id == $scope.language) {
        return l;
      }
    }
    return langs.EN;
  };

  $scope.personalPronoun_want = function() {
    var l = $scope.getLanguage();
    return $scope.personas.length > 1 ? l.we_want : l.i_want;
  };

  $scope.logout = function() {
    Meteor.logout(function(error) {
      console.log(error);
    });
  };

  $scope.showPersona = function(persona) {
    Meteor.call('scrums.persona.get', $stateParams.scrumId, persona, (error, result) => {
      if (!error) {
        $scope.personaToShow = result;
        $timeout(function() {
          $('#show_persona_modal').modal('show');
        }, 100);
      }
    });
  };

  $scope.setLanguage = function(language) {
    $scope.language = language.id;
  };

}]);
