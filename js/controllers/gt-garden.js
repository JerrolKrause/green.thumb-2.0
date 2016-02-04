/* global moment, angular */
/* jshint unused: true */

window.greenthumb.controller('gtGarden', function ($scope, gtGetData, $routeParams, gtShared) {
    'use strict';
    $scope.Math = window.Math;
    $scope.gardenID = $routeParams.gardenID;
    $scope.taskpanel = 'next';

    if($scope.gardenID !== 'mine'){
        gtGetData.load('js/models/'+$scope.gardenID+'.js');
    }

    /**
     * Step 1 for adding new produce to an area. This just sets the area ID for use in the modal window that pops up
     * @param {type} id
     * @returns {undefined}
     */
    $scope.addProduceStep1 = function (id) {
        //Send to gtShared factory
        gtShared.areaID = id;
    };

    /*
     * Fires a modal window that contains the specific plant characteristics
     * @param {type} plantID
     * @returns {undefined}
     */
    $scope.gtDetails = function(produce,areaID,produceID){
        var params = {
            areaID      : areaID,
            produceID   : produceID,
            type        : 'produce',
            label       : produce.label_full
        };
        //Update the params in gtShared for use later by the modal
        gtShared.update(params);
        
        $scope.gtSelection = produce;
    };

    /**
     * Toggle between the previous and next pain
     * @param {type} pane
     * @returns {undefined}
     */
    $scope.toggleTasks = function(pane){
        $scope.taskpanel = pane;
    };

    //When the garden model is updated, update the data on the page
    $scope.$on('dataPassed', function () {
        console.log(gtGetData);
        $scope.garden       = gtGetData.activeGarden.areas;
        $scope.label        = gtGetData.activeGarden.label;
        $scope.frost_spring = gtGetData.activeGarden.frost_spring.position;
        $scope.frost_fall   = gtGetData.activeGarden.frost_fall.position;

        $scope.main_pos     = gtGetData.params.dates.main_pos;
        $scope.today_pos    = gtGetData.params.dates.today_pos;

        $scope.tasksToday   = [];
        $scope.tasksNext    = [];
        $scope.tasksPrev    = [];

        if (angular.isDefined(gtGetData.activeGarden.tasks[gtGetData.params.dates.main.format("YYYYMMDD")])) {
            $scope.tasksToday.push(gtGetData.activeGarden.tasks[gtGetData.params.dates.main.format("YYYYMMDD")]);
        } else {
            $scope.tasksToday.push({
                label: gtGetData.params.dates.main.format("dddd, MMMM Do"),
                items: ['Nothing for Today!']
            });
        }

        //Loop through the tasks object
        angular.forEach(gtGetData.activeGarden.tasks, function (value) {
            //Check if the current task object is upcoming 1 month
            if (value.date.isBetween(gtGetData.params.dates.main.clone().add(1, 'day'), gtGetData.params.dates.main.clone().add(1, 'month'))) {
                $scope.tasksNext.push(value);
                //Check if previous task object occurs 1 month prior    
            } else if (value.date.isBetween(gtGetData.params.dates.main.clone().subtract(1, 'month'), gtGetData.params.dates.main)) {
                $scope.tasksPrev.push(value);
            }
        });
        
        /**
         * Step 1 of delete an area. Loads the content into the gtShared service to pass to the modal window
         * @param {type} areaID - Area location in the array
         * @param {type} label  - Name of the area
         * @returns {undefined}
         */
        $scope.areaDelete = function (areaID, label) {
            var params = {
                areaID      : areaID,
                type        : 'area',
                label       : label
            };
            //Update the params in gtShared for use later by the modal
            gtShared.update(params);
        };
        
        
    });
}).directive('tasks', function () {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        templateUrl: 'partials/tasks-entry.html'
    };
}).directive('areas', function () {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        replace: true,
        templateUrl: 'partials/calendar-row.html'
    };
});//end gtGarden