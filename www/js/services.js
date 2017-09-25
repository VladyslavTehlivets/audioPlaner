var services = angular.module('services', []);

services.service('plannerService', function (Days) {
    this.removeOldDates = function () {
        var today = new Date();
        for (var i = 1; i < 8; i++) {
            var activeTasks = Days.getActiveTasks(i);
            var taskDate = null;
            for (var j = activeTasks.length - 1; j >= 0; j--) {
                taskDate = new Date(activeTasks[j].date);
                if (taskDate < today) {
                    if(taskDate.getDay() < today.getDay()){
                        Days.deleteTaskAtIndex(i, j);
                    }
                }
            }
        }
    }
    this.nextActiveDay = function (activeDay) {
        var d = new Date();
        var today = d.getDay() + 1;
        var plus = today > activeDay ? 7 - today + activeDay : activeDay - today;
        var date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + plus);
        return date;
    }
});

services.service('dataManagmentService', function (Days) {
    this.deleteTaskAtIndex = function (dayId, index) {
        Days.deleteTaskAtIndex(dayId, index);
    }
    this.addDayTasks = function (dayId, tasks) {
        Days.saveActiveTasks(dayId, tasks);
    }
    this.deleteTask = function (tasks, dayId, name) {
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].name === name) {
                tasks.splice(i, 1);
                this.deleteTaskAtIndex(dayId, i);
                return;
            }
        }
    }
    this.getActiveTasks = function (day) {
        return Days.getActiveTasks(day);
    }
    this.saveActiveTasks = function (day, tasks) {
        Days.saveActiveTasks(day, tasks);
    }
    this.deleteAllTasks = function (dayId) {
        Days.deleteAllActiveTasks(dayId);
    }
    this.setLastActiveIndex = function (index) {
        Days.setLastActiveIndex(index);
    }
    this.getLastActiveIndex = function () {
        return Days.getLastActiveIndex();
    }
    this.getAllDays = function(){
        return Days.all();
    }
    this.addTaskToDay = function(task,day){
        tasks = this.getActiveTasks(day);
        tasks.push(task);
        Days.saveActiveTasks(day,tasks);
    }
});