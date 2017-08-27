angular.module('starter.controllers', [])

    .service('plannerService', function (Days) {
        this.removeOldDates = function () {
            var today = new Date();
            for (var i = 1; i < 8; i++) {
                var activeTasks = Days.getActiveTasks(i);
                var taskDate = null;
                for (var j = activeTasks.length - 1; j >= 0; j--) {
                    taskDate = new Date(activeTasks[j].date);
                    if (taskDate < today) {
                        Days.deleteTaskAtIndex(i, j);
                    }
                }
            }
        }
    })

    .factory('Days', function () {
        return {
            all: function () {
                var daysString = window.localStorage['days'];
                if (daysString) {
                    return angular.fromJson(daysString);
                }
                return [
                    { name: "Sunday", id: 1 },
                    { name: "Monday", id: 2 },
                    { name: "Tuesday", id: 3 },
                    { name: "Wednesday", id: 4 },
                    { name: "Thursday", id: 5 },
                    { name: "Friday", id: 6 },
                    { name: "Saturday", id: 7 }
                ]
            },
            getActiveTasks: function (day) {
                var activeDayTasks = window.localStorage['day' + day];
                if (activeDayTasks) {
                    return angular.fromJson(activeDayTasks);
                } return [];
            },
            saveActiveTasks: function (day, activeTasks) {
                window.localStorage['day' + day] = angular.toJson(activeTasks);
            },
            deleteAllActiveTasks: function (day) {
                window.localStorage.removeItem(['day' + day]);
            },
            deleteTaskAtIndex: function (day, index) {
                var json = JSON.parse(window.localStorage['day' + day]);
                window.localStorage.removeItem(['day' + day]);
                json.splice(index, 1);
                window.localStorage['day' + day] = JSON.stringify(json);
            },
            save: function (days) {
                window.localStorage['days'] = angular.toJson(days);
            },
            getLastActiveIndex: function () {
                return parseInt(window.localStorage['lastActiveDay']) || 0;
            },
            setLastActiveIndex: function (index) {
                window.localStorage['lastActiveDay'] = index;
            }
        }
    })

    .filter('capitalize', function () {
        return function (input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1) : '';
        }
    })

    .filter('time', function () {
        return function (input) {
            input = input.replace(/ /g, '');
            return (!!input) ? input.slice(0, 2) + ":" + input.slice(2, 4) : '';
        }
    })

    .controller('planner', function ($scope, $ionicModal, Days, $ionicSideMenuDelegate, $stateParams, $filter, ionicDatePicker, $ionicPopup) {

        var disableDays = [];
        $scope.makeDaysArray = function (without) {
            disableDays.splice(0, 6);
            for (var i = 0; i <= 6; i++) {
                if (i === without) {
                } else {
                    disableDays.push(i);
                }
            }
        }

        var ipObj1 = {
            callback: function (val) {  //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            },
            mode: 'date',
            from: new Date(),
            inputDate: new Date(),
            mondayFirst: true,
            disableWeekdays: disableDays,
            closeOnSelect: false,
            templateType: 'popup'
        };

        var nextActiveDay = function (activeDay) {
            var d = new Date(2017, 07, 28);
            var today = d.getDay() + 1;
            var plus = today > activeDay ? 7 - activeDay : activeDay - today;
            var date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + plus);
            return date;
        }

        $scope.days = Days.all();
        $scope.activeDay = $scope.days[Days.getLastActiveIndex()];
        $scope.nextDay = nextActiveDay($scope.activeDay.id);
        $scope.activeDay.tasks = Days.getActiveTasks($scope.activeDay.id);
        $scope.week = { active: false }

        // console.log($scope.activeDay.tasks);
        $scope.AllTasks = [
            Array.from(Days.getActiveTasks(1)),
            Array.from(Days.getActiveTasks(2)),
            Array.from(Days.getActiveTasks(3)),
            Array.from(Days.getActiveTasks(4)),
            Array.from(Days.getActiveTasks(5)),
            Array.from(Days.getActiveTasks(6)),
            Array.from(Days.getActiveTasks(7)),
        ];

        $scope.selectDay = function (day, index) {
            $scope.activeDay = day;
            Days.setLastActiveIndex(index);
            $scope.activeDay.tasks = Days.getActiveTasks($scope.activeDay.id);
            $scope.activeDay.tasks.push({ name: "Test task", hour: "16:00", date: nextActiveDay($scope.activeDay.id) });
            Days.saveActiveTasks($scope.activeDay.id, $scope.activeDay.tasks);    
            $scope.week.active = false;
        }

        var updateWeekTasks = function () {
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
        }

        $scope.selectWeek = function () {
            $scope.activeDay = null;
            $scope.week.active = true;
            updateWeekTasks();
        }

        $scope.recognizedText = "";
        $scope.recognizedHour = "";

        //++ recording part
        $scope.recordText = function () {
            var recognition = new (webkitSpeechRecognition || SpeechRecognition);
            recognition.lang = 'pl-PL';
            recognition.maxAlternatives = 5;

            recognition.onresult = function (event) {
                if (event.results.length > 0) {
                    $scope.recognizedText = event.results[0][0].transcript;
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
                    $scope.recognizedHour = event.results[0][0].transcript;
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
            var date = nextActiveDay();

            addTasksToActiveDay(name, hour, date);

            $scope.closeAddPlan();
            $scope.$apply;
        };

        var addTasksToActiveDay = function (taskName, taskHour, taskDate) {
            $scope.activeDay.tasks.push({
                name: taskName,
                hour: taskHour,
                date: date
            });
            Days.saveActiveTasks($scope.activeDay.id, $scope.activeDay.tasks);
        };

        $scope.deleteTask = function (name) {
            for (var i = 0; i < $scope.activeDay.tasks.length; i++) {
                if ($scope.activeDay.tasks[i].name === name) {
                    $scope.activeDay.tasks.splice(i, 1);
                    Days.deleteTaskAtIndex($scope.activeDay.id, i);
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
                cssClass: 'round'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    $scope.activeDay.tasks.splice(0, $scope.activeDay.tasks.length);
                    $scope.$apply;
                    Days.deleteAllActiveTasks($scope.activeDay.id);
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

        $scope.openDatePicker = function () {
            $scope.makeDaysArray($scope.activeDay.id - 1);
            ionicDatePicker.openDatePicker(ipObj1);
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
