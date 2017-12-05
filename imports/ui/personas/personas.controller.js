import '../persona_entry/persona_entry.directive.js';


angular.module('scrumboard').controller('PersonasController', ['$scope', '$reactive', '$location', function($scope, $reactive, $location) {

  $scope.createPersona = function() {
    $location.path('/scrums/' + $scope.scrum._id + '/personas/');
  };

}]);
