var filters = angular.module('filters',[]);

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