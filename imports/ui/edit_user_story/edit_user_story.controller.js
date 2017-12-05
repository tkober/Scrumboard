angular.module('scrumboard').controller('EditUserStoryController', ['$scope', '$location', '$stateParams', '$reactive', function($scope, $location, $stateParams, $reactive) {
  $reactive(this).attach($scope);

  $scope.error = null;
  $scope.personas = [];
  $scope.goal = null;
  $scope.reason = null;
  $scope.newAC = null;
  $scope.epic = null;
  $scope.acceptanceCriteria = [];

  Meteor.call('scrums.personas.get', $stateParams.scrumId, (error, result) => {
    $scope.error = error;
    if (!error) {
      $scope.availablePersonas = result;
      $scope.$apply();
    }
  });

  $scope.save = function() {
    Meteor.call('scrums.userstories.create', $scope.epic,
    angular.toJson($scope.personas),
    angular.toJson($scope.acceptanceCriteria),
    $scope.goal,
    $scope.reason,
    $stateParams.scrumId, (error, result) => {
      if (error) {
        $scope.error = error;
      } else {
        $scope.cancel();
      }
      $scope.$apply();
    });
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

  $scope.personalPronoun = function() {
    return $scope.personas.length > 1 ? 'We' : 'I';
  };

  $scope.logout = function() {
    Meteor.logout(function(error) {
      console.log(error);
    });
  };

}]);
