angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.factory('Days', function(){
    return{
      save: function(days){
          window.localStorage['days'] = angular.toJson(days);
      },
      getLastActiveIndex: function() {
          return parseInt(window.localStorage['lastActiveDay']) || 0;
      },
      setLastActiveIndex: function(index) {
          window.localStorage['lastActiveDay'] = index;
      }
    }
})

.controller('planner', function($scope, $ionicModal, Days, $ionicSideMenuDelegate,$stateParams){
    $scope.days = [
      { name: "Sunday", id: 1},
      { name: "Monday", id: 2},
      { name: "Tuesday", id: 3},
      { name: "Wednesday", id: 4},
      { name: "Thursday", id: 5},
      { name: "Friday", id: 6},
      { name: "Saturday", id: 7}
    ];

    $scope.activeDay = $scope.days[Days.getLastActiveIndex()];

    $scope.selectDay = function(day, index){
      $scope.activeDay = day;
      Days.setLastActiveIndex(index);
    }

    $scope.getTitle = function(){
      return $scope.activeDay.name;
    }

});