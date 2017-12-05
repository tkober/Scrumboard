angular.module('scrumboard').controller('EditPersonasController', ['$scope', '$location', '$stateParams', '$reactive', function($scope, $location, $stateParams, $reactive) {
  $reactive(this).attach($scope);

  $scope.personaToEdit = $stateParams.personId;

  $scope.error = null;
  $scope.name = null;


  if ($scope.personaToEdit) {
    // this.call('scrums.get', $scope.scrumToEdit, (error, result) => {
    //   $scope.error = error;
    //   if (!error) {
    //     $scope.title = result.name;
    //     load_users(this, function() {
    //       users = $scope.users.slice()
    //       for (i = 0; i < users.length; i++) {
    //         user = users[i];
    //         if (result.participants.indexOf(user._id) != -1) {
    //           $scope.invite(user);
    //         }
    //       }
    //     });
    //   }
    // });
  }

  $scope.save = function() {
    if ($scope.personaToEdit) {
      // Meteor.call('scrums.update', $scope.scrumToEdit, $scope.title, angular.toJson(participantsIds), (error, result) => {
      //   if (error) {
      //     $scope.error = error;
      //   } else {
      //     $scope.cancel();
      //   }
      //   $scope.$apply();
      // });
    } else {
      Meteor.call('scrums.personas.create', $scope.name, $stateParams.scrumId, (error, result) => {
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

}]);
