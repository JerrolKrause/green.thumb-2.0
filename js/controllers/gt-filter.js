/* global moment, angular */
/* jshint unused: true */

/**
 * Manage the filtering/sorting behavior
 */
window.greenthumb.controller('gtFilter', function ($scope, gtGetData) {
    'use strict';
    //Needed by calendar dropdown
    $scope.open     = function () { $scope.status.opened = true;};
    $scope.status   = {opened: false};
    $scope.date     = new Date();

    /**
     * When filter sorting params have been adjusted
     * Just contains the date element at the moment
     * @returns {undefined}
     */
    $scope.filterSort = function(){
        var params = {
            dates : {
                main : moment($scope.date)
            }
        };

        gtGetData.update(params);
    };
});//end gtFilter