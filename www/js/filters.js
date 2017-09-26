var filters = angular.module('filters', ['services']);

filters.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1) : '';
    }
});

filters.filter('time', function () {
    return function (input) {
        input = input.replace(/ /g, '');
        return (!!input) ? input.slice(0, 2) + ":" + input.slice(2, 4) : '';
    }
});

filters.filter('nextWeek', function (plannerService) {
    return function (tasks, i) {
        var filtered = [];
        nextWeekStart = plannerService.nextActiveDay(1);
        nextWeekInc = new Date(nextWeekStart.getFullYear(), nextWeekStart.getMonth(), nextWeekStart.getDate() + i * 7);
        nextWeekEnd = new Date(nextWeekStart.getFullYear(), nextWeekStart.getMonth(), nextWeekStart.getDate() + i * 7 + 7);
        angular.forEach(tasks, function (element) {
            taskDate = new Date(element.date);
            if (i === 0) {
                today = new Date();
                if (today.getDay() === nextWeekStart.getDay()) {
                    nextWeekStart = new Date(nextWeekStart.getFullYear(), nextWeekStart.getMonth(), nextWeekStart.getDate() + 7);
                }
                if (taskDate < nextWeekStart) {
                    filtered.push(element);
                }
            } else if (i === 1){
                if(taskDate >= nextWeekStart && taskDate < nextWeekInc){
                    filtered.push(element);
                }    
            } else {
                if (taskDate >= nextWeekInc && taskDate < nextWeekEnd) {
                    filtered.push(element);
                }
            }
        });
        return filtered;
    }
});