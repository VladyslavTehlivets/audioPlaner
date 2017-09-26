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
    $scope.week = 0;
    $scope.nextWeek = function () {
        $scope.week += 1;
    }
    $scope.previousWeek = function () {
        $scope.week -= 1;
    }
    $scope.checkNextWeek = function (tasks) {
        var nextWeekFilter = $filter('nextWeek');
        var list = nextWeekFilter(tasks, $scope.week);
        if (list.length > 0) {
            return true;
        } return false;
    }
});

controllers.controller('planner', function ($scope, $rootScope, $ionicModal, Days, $ionicSideMenuDelegate,
    $stateParams, $filter, ionicDatePicker, $ionicPopup, plannerService, dataManagmentService) {

    $scope.editing = false;
    $scope.editingNegate = function () {
        $scope.editing = !$scope.editing;
    }

    $scope.myDate = new Date();

    $scope.days = dataManagmentService.getAllDays();

    $scope.activeDay = $scope.days[dataManagmentService.getLastActiveIndex()];
    $scope.activeDay.tasks = dataManagmentService.getActiveTasks($scope.activeDay.id);
    $scope.week = { active: false }

    $scope.selectDay = function (day) {
        $scope.activeDay = day;
        dataManagmentService.setLastActiveIndex(day.id - 1);
        $scope.week.active = false;
    }

    $scope.selectWeek = function () {
        $scope.activeDay = null;
        $scope.week.active = true;
        $rootScope.$emit("updateWeekTasks", {});
    }

    $scope.recorded = {
        taskName: "", taskHour: ""
    };

    //++ recording part
    $scope.recordText = function () {
        var recognition = new (webkitSpeechRecognition || SpeechRecognition);
        recognition.lang = 'pl-PL';
        recognition.maxAlternatives = 5;

        recognition.onresult = function (event) {
            if (event.results.length > 0) {
                $scope.recorded.taskName = event.results[0][0].transcript;
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

        recognition.onresult = function (event) {
            if (event.results.length > 0) {
                $scope.recorded.taskHour = event.results[0][0].transcript;
                $scope.$apply();
            }
        }
        recognition.start();
    };
    //-----recording part end

    $scope.submit = function (recorded) {
        var capitalize = $filter('capitalize');
        var time = $filter('time');
        var dateFilter = $filter('date');

        var name = capitalize(recorded.taskName);
        var hour = time(recorded.taskHour);
        // var date = dateFilter(plannerService.nextActiveDay($scope.activeDay.id),'short');
        var date = plannerService.nextActiveDay($scope.activeDay.id);

        recorded.taskName = "";
        recorded.taskHour = "";

        addTaskToActiveDay(name, hour, date);
        $scope.closeAddPlan();
    };

    var addTaskToActiveDay = function (taskName, taskHour, taskDate) {
        var task = { name: taskName, hour: taskHour, date: taskDate };
        dataManagmentService.addTaskToDay(task, $scope.activeDay.id);
        updateTasks();
    };

    $scope.deleteTask = function (name) {
        dataManagmentService.deleteTask($scope.activeDay.tasks, $scope.activeDay.id, name);
        updateTasks();
    }

    var updateTasks = function () {
        $scope.activeDay.tasks.splice(0, $scope.activeDay.tasks.length);
        $scope.activeDay.tasks = dataManagmentService.getActiveTasks($scope.activeDay.id);
    }

    var deleteAllTasks = function () {
        dataManagmentService.deleteAllTasks($scope.activeDay.id);
        updateTasks();
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
                deleteAllTasks();
            } else {
                console.log('You are not sure');
            }
        });
    };

    //work with datapicker
    var disableDays = [];
    var makeDaysArray = function (without) {
        disableDays.splice(0, 6);
        for (var i = 0; i <= 6; i++) {
            if (i === without) {
            } else {
                disableDays.push(i);
            }
        }
    }
    var datePickerConfig = {
        callback: function (val) {
            date = new Date(val);
            $scope.$emit("updateTask", { date });
        },
        mode: 'date',
        from: new Date(),
        inputDate: new Date(),
        mondayFirst: true,
        disableWeekdays: disableDays,
        closeOnSelect: false,
        templateType: 'popup'
    }

    $scope.openDatePicker = function (taskName, taskHour) {
        makeDaysArray($scope.activeDay.id - 1);
        ionicDatePicker.openDatePicker(datePickerConfig);
        $scope.$on("updateTask", function (event, date) {
            $scope.deleteTask(taskName);
            addTaskToActiveDay(taskName, taskHour, date.date);
        });
    }
    //end work with datapicker

    //work with model
    $ionicModal.fromTemplateUrl('templates/addPlan.html', {
        scope: $scope,
        controller: 'planner',
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

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