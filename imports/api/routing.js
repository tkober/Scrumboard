import { Device } from './helpers/device.js';

import '../ui/home/home.controller.js';
import '../ui/home/home.template.html';

import '../ui/scrum/scrum.controller.js';
import '../ui/scrum/scrum.template.html';

import '../ui/configure_scrum/configure_scrum.controller.js';
import '../ui/configure_scrum/configure_scrum.template.html';

import '../ui/edit_personas/edit_personas.controller.js';
import '../ui/edit_personas/edit_personas.template.html';

import '../ui/edit_user_story/edit_user_story.controller.js';
import '../ui/edit_user_story/edit_user_story.template.html';


angular.module('scrumboard').config(function($stateProvider, $urlRouterProvider) {
  'ngInject';

  $urlRouterProvider.otherwise('/not_found');

  // Default Routing
  $stateProvider.state('notFound', {
    url: '/not_found',
    template: '<h1>404</h1>'
  })

  .state('index', {
    url: '',
    templateUrl: 'imports/ui/home/home.template.html',
    controller: 'HomeController'
  })

  .state('index.explicite', {
    url: '/',
    templateUrl: 'imports/ui/home/home.template.html',
    controller: 'HomeController'
  })

  .state('create_scrum', {
    url: '/scrums',
    templateUrl: 'imports/ui/configure_scrum/configure_scrum.template.html',
    controller: 'ConfigureScrumController'
  })

  .state('edit_scrum', {
    url: '/scrums/:scrumId/edit',
    templateUrl: 'imports/ui/configure_scrum/configure_scrum.template.html',
    controller: 'ConfigureScrumController'
  })

  .state('scrum', {
    url: '/scrums/:scrumId',
    templateUrl: 'imports/ui/scrum/scrum.template.html',
    controller: 'ScrumController'
  })

  .state('create_persona', {
    url: '/scrums/:scrumId/personas',
    templateUrl: 'imports/ui/edit_personas/edit_personas.template.html',
    controller: 'EditPersonasController'
  })

  .state('edit_persona', {
    url: '/scrums/:scrumId/personas/:personaId',
    templateUrl: 'imports/ui/edit_personas/edit_personas.template.html',
    controller: 'EditPersonasController'
  })

  .state('create_user_story', {
    url: '/scrums/:scrumId/backlog/story',
    templateUrl: 'imports/ui/edit_user_story/edit_user_story.template.html',
    controller: 'EditUserStoryController'
  })

  .state('edit_user_story', {
    url: '/scrums/:scrumId/backlog/story/:storyId',
    templateUrl: 'imports/ui/edit_user_story/edit_user_story.template.html',
    controller: 'EditUserStoryController'
  });

  if (Device === 'desktop') {
    // Desktop Specific Routing

  } else {
    // Mobile Specific Routing

  }

});
