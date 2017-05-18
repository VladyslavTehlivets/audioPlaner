// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var planer = angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'planner'
  })

  .state('app.audioPlans', {
    url: '/audioPlans',
    views: {
      'menuContent': {
        cache: false,
        templateUrl: 'templates/audioPlans.html',
        controller: 'planner'
      },
      'modal':{
        templateUrl: 'templates/addPlan.html',
        controller: 'planner',
        filter: 'capitalize'
      }
    }
  })

  .state('app.day',{
    url: '/audioPlans/:dayId',
    views: {
      'menuContent':{
        cache: false,
        templateUrl: 'templates/audioPlans.html',
        controller: 'planner'
      }
    }
  })
  
  $urlRouterProvider.otherwise('/app/audioPlans');
});
