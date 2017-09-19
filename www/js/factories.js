var factories = angular.module('factories',[]);

factories.factory('Days', function () {
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
                { name: "Saturday", id: 7}
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
});