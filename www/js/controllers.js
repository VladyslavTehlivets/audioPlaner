angular.module('starter.controllers', [])

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

.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1) : '';
    }
})

.controller('planner', function($scope, $ionicModal, Days, $ionicSideMenuDelegate,$stateParams,$filter){
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

    $scope.activeDay.tasks = [];  

    //recording part
    $scope.recognizedText = "Test";
    $scope.recognizedHour = "10:00";
    
    $scope.recordText = function(){
      var recognition = new (webkitSpeechRecognition || SpeechRecognition);
      recognition.lang = 'pl-PL';
      recognition.maxAlternatives = 5;

      recognition.onresult = function(event){
        if(event.results.length > 0){
          $scope.recognizedText = event.results[0][0].transcript;
          $scope.$apply();
        }
      }
      recognition.start();
    };

    $scope.recordHour = function(){
        var recognition = new (webkitSpeechRecognition || SpeechRecognition)  ;
        recognition.lang = 'pl-PL';
        recognition.maxAlternatives = 5;

        recognition.onresult = function(event){
        if(event.results.length > 0){
          $scope.recognizedHour = event.results[0][0].transcript;
          $scope.$apply();
        }
      }
      recognition.start();
    };

    $scope.submit = function(){
      console.log($scope.recognizedText);
        var capitalize = $filter('capitalize');
        $scope.activeDay.tasks.push({
          name: capitalize($scope.recognizedText),
          hour: $scope.recognizedHour
      });
      console.log($scope.recognizedText);
      console.log($scope.recognizedHour);
      $scope.recognizedText = "";
      $scope.recognizedHour = "";
      $scope.closeAddPlan();
      $scope.$apply;
    };
  
   
    $ionicModal.fromTemplateUrl('templates/addPlan.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openAddPlan = function(){
        $scope.modal.show();
    };
    
    $scope.closeAddPlan = function() {
        console.log("cansel");
        $scope.recognizedText = "";
        $scope.recognizedHour = "";
        $scope.modal.hide();
    };

     $scope.$on('modal.hidden', function() {
        $scope.recognizedText = "";
        $scope.recognizedHour = "";
    });

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.clrActivePlans = function(){
        $scope.activeDay.tasks.splice(0,$scope.activeDay.tasks.length);
    };
});