import '../../api/routing.js';

import './main.template.html';
import './main.controller.js';

import '../welcome/welcome.directive.js';


angular.module('scrumboard').directive('main', function() {
  return {
    'restrict': 'E',
    'templateUrl': 'imports/ui/main/main.template.html',
    controller: 'MainController'
  };
});
