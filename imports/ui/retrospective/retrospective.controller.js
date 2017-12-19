angular.module('scrumboard').controller('RetrospectiveController', ['$scope', function($scope) {

  $scope.newGoodItem = null;
  $scope.newPoorItem = null;
  $scope.newTryItem = null;
  $scope.newKeepItem = null;
  $scope.newDropItem = null;

  $scope.isValidItem = function(item) {
    return item != null && item.length > 0;
  };

  $scope.addGoodItem = function() {
    Meteor.call('scrums.retrospective.addItem', $scope.scrum._id, $scope.newGoodItem, 'good', (error) => {
      $scope.error = error;
      if (!error) {
        $scope.newGoodItem = null;
      }
      $scope.$apply();
    });
  };

  $scope.addPoorItem = function() {
    Meteor.call('scrums.retrospective.addItem', $scope.scrum._id, $scope.newPoorItem, 'poor', (error) => {
      $scope.error = error;
      if (!error) {
        $scope.newPoorItem = null;
      }
      $scope.$apply();
    });
  };

  $scope.addTryItem = function() {
    Meteor.call('scrums.retrospective.addItem', $scope.scrum._id, $scope.newTryItem, 'try', (error) => {
      $scope.error = error;
      if (!error) {
        $scope.newTryItem = null;
      }
      $scope.$apply();
    });
  };

  $scope.addKeepItem = function() {
    Meteor.call('scrums.retrospective.addItem', $scope.scrum._id, $scope.newKeepItem, 'keep', (error) => {
      $scope.error = error;
      if (!error) {
        $scope.newKeepItem = null;
      }
      $scope.$apply();
    });
  };

  $scope.addDropItem = function() {
    Meteor.call('scrums.retrospective.addItem', $scope.scrum._id, $scope.newDropItem, 'drop', (error) => {
      $scope.error = error;
      if (!error) {
        $scope.newDropItem = null;
      }
      $scope.$apply();
    });
  };

  $scope.showSecondStep = function() {
    return $scope.scrum.sprint.status == 'ended';
  };

}]);
