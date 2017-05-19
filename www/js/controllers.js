angular.module('starter.controllers', [])

.factory('Days', function(){
      return{
      all: function() {
        var daysString = window.localStorage['days'];
        if(daysString) {
            return angular.fromJson(daysString);
        }
        return [
            { name: "Sunday", id: 1},
            { name: "Monday", id: 2},
            { name: "Tuesday", id: 3},
            { name: "Wednesday", id: 4},
            { name: "Thursday", id: 5},
            { name: "Friday", id: 6},
            { name: "Saturday", id: 7}
        ]
      },
      getActiveTasks: function(day){
          var activeDayTasks = window.localStorage['day' + day];
          if(activeDayTasks){
              return angular.fromJson(activeDayTasks);
          } return [];
      },
      saveActiveTasks: function(day,activeTasks){
            window.localStorage['day' + day] = angular.toJson(activeTasks);
      },
      deleteAllActiveTasks: function(day){
          window.localStorage.removeItem(['day'+day]);
      },
      deleteTaskAtIndex: function(day,index){
          var json = JSON.parse(window.localStorage['day'+day]);
          window.localStorage.removeItem(['day'+day]);
          json.splice(index,1);
          window.localStorage['day'+day] = JSON.stringify(json);
      },
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

    $scope.days = Days.all();

    $scope.activeDay = $scope.days[Days.getLastActiveIndex()];

    $scope.activeDay.tasks = Days.getActiveTasks($scope.activeDay.id);

    $scope.selectDay = function(day, index){
      $scope.activeDay = day;
      Days.setLastActiveIndex(index);
    }

    $scope.getTitle = function(){
      return $scope.activeDay.name;
    }

    //recording part
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
        var capitalize = $filter('capitalize');
        $scope.activeDay.tasks.push({
          name: capitalize($scope.recognizedText),
          hour: $scope.recognizedHour
      });
      $scope.closeAddPlan();
      Days.saveActiveTasks($scope.activeDay.id,$scope.activeDay.tasks);
      $scope.$apply;
    };

    
    $scope.deleteShow = false;
    $scope.showDelete = function(){
        $scope.deleteShow = !$scope.deleteShow;
    }

    $scope.deleteTask = function(name){
        for(var i = 0; i < $scope.activeDay.tasks.length;i++){
            if($scope.activeDay.tasks[i].name===name){
                $scope.activeDay.tasks.splice(i,1);
                Days.deleteTaskAtIndex($scope.activeDay.id,i);
            }
        }
    }
  
    //work with model
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
        $scope.recognizedText = "";
        $scope.recognizedHour = "";
        $scope.modal.hide();
    };

    $scope.$on('modal.hidden', function() {
        
    });

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    //end work with model
});