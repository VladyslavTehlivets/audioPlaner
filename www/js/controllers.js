var controllers = angular.module('starter.controllers', ['filters', 'services', 'factories']);

controllers.controller('weekCtrl', function ($scope, $rootScope, Days, $ionicSideMenuDelegate, $filter, plannerService) {

    $rootScope.$on("updateWeekTasks", function () {
        $scope.updateWeekTasks();
    });

    $scope.AllTasks = [
        Array.from(Days.getActiveTasks(1)),
        Array.from(Days.getActiveTasks(2)),
        Array.from(Days.getActiveTasks(3)),
        Array.from(Days.getActiveTasks(4)),
        Array.from(Days.getActiveTasks(5)),
        Array.from(Days.getActiveTasks(6)),
        Array.from(Days.getActiveTasks(7)),
    ];

    $scope.updateWeekTasks = function () {
        $scope.AllTasks.splice(0, 7);
        $scope.AllTasks = [
            Array.from(Days.getActiveTasks(1)),
            Array.from(Days.getActiveTasks(2)),
            Array.from(Days.getActiveTasks(3)),
            Array.from(Days.getActiveTasks(4)),
            Array.from(Days.getActiveTasks(5)),
            Array.from(Days.getActiveTasks(6)),
            Array.from(Days.getActiveTasks(7)),
        ];
    };
});

controllers.controller('planner', function ($scope, $rootScope, $ionicModal, Days, $ionicSideMenuDelegate,
    $stateParams, $filter, ionicDatePicker, $ionicPopup, plannerService) {

    $scope.editing = false;
    $scope.editingNegate = function () {
        $scope.editing = !$scope.editing;
    }

    $scope.myDate - new Date();

    $scope.days = Days.all();
    $scope.activeDay = $scope.days[Days.getLastActiveIndex()];
    $scope.activeDay.tasks = Days.getActiveTasks($scope.activeDay.id);
    $scope.week = { active: false }

    $scope.selectDay = function (day, index) {
        $scope.activeDay = day;
        Days.setLastActiveIndex(index);
        $scope.activeDay.tasks = Days.getActiveTasks($scope.activeDay.id);
        $scope.$apply;
        $scope.week.active = false;
    }

    $scope.selectWeek = function () {
        $scope.activeDay = null;
        $scope.week.active = true;
        $rootScope.$emit("updateWeekTasks", {});
    }

    $scope.recognizedText = "";
    $scope.recognizedHour = "";

    //++ recording part
    $scope.recordText = function () {
        var recognition = new (webkitSpeechRecognition || SpeechRecognition);
        recognition.lang = 'pl-PL';
        recognition.maxAlternatives = 5;

        // recognition.onstart = function (event) {
        //     $scope.recognitionStart = true;
        // }

        recognition.onresult = function (event) {
            if (event.results.length > 0) {
                $scope.recognizedText = event.results[0][0].transcript;
                $scope.recognitionStart = false;
                $scope.$apply();
            }
        }

        recognition.start();
    };

    $scope.recordHour = function () {
        var recognition = new (webkitSpeechRecognition || SpeechRecognition);
        recognition.lang = 'pl-PL';
        recognition.maxAlternatives = 5;

        // recognition.onstart = function (event) {
        //     $scope.recognitionStart = true;
        // }

        recognition.onresult = function (event) {
            if (event.results.length > 0) {
                $scope.recognizedHour = event.results[0][0].transcript;
                $scope.recognitionStart = false;
                $scope.$apply();
            }
        }

        recognition.start();
    };
    //-----recording part end

    $scope.submit = function () {
        var capitalize = $filter('capitalize');
        var time = $filter('time');

        var name = capitalize($scope.recognizedText);
        var hour = time($scope.recognizedHour);
        var date = plannerService.nextActiveDay($scope.activeDay.id);

        addTasksToActiveDay(name, hour, date);

        $scope.closeAddPlan();
        $scope.$apply;
    };

    var addTasksToActiveDay = function (taskName, taskHour, taskDate) {
        $scope.activeDay.tasks.push({
            name: taskName,
            hour: taskHour,
            date: taskDate
        });
        Days.saveActiveTasks($scope.activeDay.id, $scope.activeDay.tasks);
    };

    $scope.deleteTask = function (name) {
        for (var i = 0; i < $scope.activeDay.tasks.length; i++) {
            if ($scope.activeDay.tasks[i].name === name) {
                $scope.activeDay.tasks.splice(i, 1);
                Days.deleteTaskAtIndex($scope.activeDay.id, i);
                return;
            }
        }
    }

    $scope.clrActivePlans = function () {
        $scope.showConfirm();
    }

    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete all tasks',
            template: 'Are you sure you want to delete all tasks?',
        });

        confirmPopup.then(function (res) {
            if (res) {
                $scope.activeDay.tasks.splice(0, $scope.activeDay.tasks.length);
                Days.deleteAllActiveTasks($scope.activeDay.id);
                $scope.$apply;
            } else {
                console.log('You are not sure');
            }
        });
    };

    //work with model
    $ionicModal.fromTemplateUrl('templates/addPlan.html', {
        scope: $scope,
        controller: 'planner',
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    //end workd with model

    $scope.openDatePicker = function () {
        // $scope.makeDaysArray($scope.activeDay.id - 1);
        plannerService.makeDaysArray($scope.activeDay.id - 1);
        ionicDatePicker.openDatePicker(plannerService.datePickerConfig);
    }

    $scope.openAddPlan = function () {
        $scope.modal.show();
    };

    $scope.closeAddPlan = function () {
        $scope.recognizedText = "";
        $scope.recognizedHour = "";
        $scope.modal.hide();
    };
    //end work with model
});
