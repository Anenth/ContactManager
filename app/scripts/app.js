'use strict';

angular.module('ContactManager', ['ngRoute'])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'HomeCtrl'
  }).when('/add', {
    templateUrl: 'views/add.html',
    controller: 'AddCtrl'
  }).when('/edit/:id', {
    templateUrl: 'views/add.html',
    controller: 'EditCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
});

angular.module('ContactManager')
.factory('FlashService', function($rootScope) {
  return {
    show: function(message,type) {
      $rootScope.flash = message;
      $rootScope.flashType = type;
    },
    clear: function() {
      $rootScope.flash = '';
    }
  };
});