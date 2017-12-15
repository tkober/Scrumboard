angular.module('scrumboard').controller('BurndownController', ['$scope', '$filter', function($scope, $filter) {

  var idFromTimestamp = function(date) {
    return $filter('date')(date, 'dd.MM.yyyy');
  };

  var resultElement = function(date) {
    return {
      id: idFromTimestamp(date),
      label: $filter('date')(date, 'EEE') ,
      taskCount: 0
    };
  }

  var calculateBurndown = function(sprint) {
    var begin = sprint.begin;
    var end = sprint.end;
    if (end < new Date()) {
      end = new Date();
    }

    var currentDate = new Date(begin);
    var result = [];
    while (currentDate <= end) {
      result.push(resultElement(currentDate));
      currentDate.setTime(currentDate.getTime() + (24 * 60 * 60 * 1000));
    }

    var prevCount = 0;
    var prevId = 0;

    var countMap = {};
    for (var i = 0; i < sprint.burndown.length; i++) {
      var snapshot = sprint.burndown[i];
      var openCount = snapshot.todo + snapshot.inProgress + snapshot.review;
      countMap[idFromTimestamp(snapshot.timestamp)] = openCount;
    }

    var max = 0;
    for (var i = 0; i < result.length; i++) {
      var day = result[i];
      if (countMap[day.id]) {
        var count = countMap[day.id];
        max = Math.max(max, count);
        day.taskCount = count;
      }
    }

    $scope.begin = begin;
    $scope.end = end;
    $scope.days = result;
    $scope.maximumTaskCount = max;
  };
  calculateBurndown($scope.scrum.sprint);

}]);
