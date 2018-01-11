import './edit_personas.less';


angular.module('scrumboard').controller('EditPersonasController', ['$scope', '$location', '$stateParams', '$reactive', function($scope, $location, $stateParams, $reactive) {
  $reactive(this).attach($scope);

  $scope.personaToEdit = $stateParams.personaId;

  $scope.error = null;
  $scope.name = null;
  $scope.html = '';
  $scope.showPreview = false;

  if ($scope.personaToEdit) {
    this.call('scrums.persona.get', $stateParams.scrumId, $scope.personaToEdit, (error, result) => {
      $scope.error = error;
      if (!error) {
        $scope.name = result.name;
        $scope.html = result.html;
      }
    });
  }

  $scope.save = function() {
    if ($scope.personaToEdit) {
      Meteor.call('scrums.personas.update', $stateParams.scrumId, $scope.personaToEdit, $scope.name, $scope.html, (error, result) => {
        if (error) {
          $scope.error = error;
        } else {
          $scope.cancel();
        }
        $scope.$apply();
      });
    } else {
      Meteor.call('scrums.personas.create', $stateParams.scrumId, $scope.name, $scope.html, (error, result) => {
        if (error) {
          $scope.error = error;
        } else {
          $scope.cancel();
        }
        $scope.$apply();
      });
    }
  };

  $scope.cancel = function() {
    $location.path('/scrums/' + $stateParams.scrumId);
  };

  $scope.isValid = function() {
    return $scope.name != null &&
      $scope.name.length > 0
  };

  $scope.email = function() {
    return Meteor.user().emails[0].address;
  };

  $scope.logout = function() {
    Meteor.logout(function(error) {
      console.log(error);
    });
  };

}]).filter("trust", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);
