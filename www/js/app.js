var planer = angular.module('starter', ['ionic', 'starter.controllers', 'ionic-datepicker']);

planer.run(function ($ionicPlatform, plannerService) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  plannerService.removeOldDates();
});

planer.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      css: 'css/style.css',
      controller: 'planner'
    })

    .state('app.audioPlans', {
      url: '/audioPlans',
      views: {
        'menuContent': {
          templateUrl: 'templates/audioPlans.html',
          css: 'css/style.css',
          controller: 'planner'
        },
        'modal': {
          templateUrl: 'templates/addPlan.html',
          controller: 'planner',
          css: 'css/style.css',
          filter: 'capitalize',
          filter: 'time'
        }
      }
    })

    .state('app.day', {
      url: '/audioPlans/:dayId',
      views: {
        'menuContent': {
          cache: false,
          templateUrl: 'templates/audioPlans.html',
          controller: 'planner'
        }
      }
    })

    .state('app.week', {
      url: '/weekPlans',
      views: {
        'menuContent': {
          cache: false,          
          templateUrl: 'templates/weekPlans.html',
          controller: 'weekCtrl',
          filter: 'next-week'
        }
      }
    })

  $urlRouterProvider.otherwise('/app/audioPlans');
});
