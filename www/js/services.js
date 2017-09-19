var services = angular.module('services',[]);

services.service('plannerService', function (Days) {
    var disableDays = [];
    this.makeDaysArray = function (without) {
        disableDays.splice(0, 6);
        for (var i = 0; i <= 6; i++) {
            if (i === without) {
            } else {
                disableDays.push(i);
            }
        }
        return disableDays;
    }
    this.datePickerConfig = {
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
    }
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
    this.nextActiveDay = function (activeDay) {
        var d = new Date();
        var today = d.getDay() + 1;
        var plus = today > activeDay ? 7 - activeDay : activeDay - today;
        var date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + plus);
        return date;
    }
});