import './configure_scrum.less';


angular.module('scrumboard').controller('ConfigureScrumController', ['$scope', '$location', '$stateParams', '$reactive', function($scope, $location, $stateParams, $reactive) {
  $reactive(this).attach($scope);

  $scope.scrumToEdit = $stateParams.scrumId;

  $scope.error = null;
  $scope.participants = [];
  $scope.users = [];
  $scope.title = null;

  load_users = function(_this, completion) {
    _this.call('users.get', $scope.presettingId, (error, result) => {
      $scope.error = error;
      if (!error) {
        users = [];
        for (i = 0; i < result.length; i++) {
          user = result[i];
          if (user._id != Meteor.userId()) {
            users.push(user);
          }
        }
        $scope.users = users;

        if (completion) {
          completion();
        }
      }
    });
  }


  if ($scope.scrumToEdit) {
    this.call('scrums.get', $scope.scrumToEdit, (error, result) => {
      $scope.error = error;
      if (!error) {
        $scope.title = result.name;
        load_users(this, function() {
          users = $scope.users.slice()
          for (i = 0; i < users.length; i++) {
            user = users[i];
            if (result.participants.indexOf(user._id) != -1) {
              $scope.invite(user);
            }
          }
        });
      }
    });
  } else {
    load_users(this);
  }

  $scope.invite = function(user) {
    index = $scope.users.indexOf(user);
    $scope.users.splice(index, 1);
    $scope.participants.push(user);
  };

  $scope.disinvite = function(user) {
    index = $scope.participants.indexOf(user);
    $scope.participants.splice(index, 1);
    $scope.users.push(user);
  };

  $scope.save = function() {
    participantsIds = [];
    for (i = 0; i < $scope.participants.length; i++) {
      participantsIds.push($scope.participants[i]._id);
    }
    if ($scope.scrumToEdit) {
      Meteor.call('scrums.update', $scope.scrumToEdit, $scope.title, angular.toJson(participantsIds), (error, result) => {
        if (error) {
          $scope.error = error;
        } else {
          $scope.cancel();
        }
        $scope.$apply();
      });
    } else {
      Meteor.call('scrums.create', $scope.title, angular.toJson(participantsIds), (error, result) => {
        if (error) {
          $scope.error = error;
        } else {
          $scope.openBoard(result);
        }
        $scope.$apply();
      });
    }
  };

  $scope.openBoard = function(id) {
    $location.path('/scrums/' + id);
  };

  $scope.cancel = function() {
    $location.path('/');
  };

  $scope.isValid = function() {
    return $scope.title != null &&
      $scope.title.length > 0
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
