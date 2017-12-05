import './welcome.controller.js';
import './welcome.template.html';


angular.module('scrumboard').directive('welcome', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/welcome/welcome.template.html',
    controller: 'WelcomController'
  };
});
