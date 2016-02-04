/* global moment, angular */
/* jshint unused: true */

/**
 * Manage the produce select component
 */

window.greenthumb.controller('gtInteractive', function ($scope, $rootScope, gtGetData, gtShared) {
    'use strict';
   
    $scope.addProduce       = {};
    $scope.error            = {
        date                : false
    };
    //Needed by calendar dropdown
    $scope.open             = function () { $scope.status.opened = true;};
    $scope.status           = {opened: false};
    $scope.options          = {
        //date   : new Date()
    };


    //Create an array for the produce search tool
    var produce = [];
    angular.forEach(gtGetData.produce, function (value, key) {
        var searchObj = {
            id      : key,
            img     : key,
            label   : value.label
        };

        if (value.parent) {
            searchObj.img   = value.parent;
            searchObj.label = gtGetData.produce[value.parent].label + ', ' + searchObj.label;
        }

        produce.push(searchObj);
    });
    //Now that the produce array has been created, assign it to the type ahead object
    $scope.produce = produce;


    //When the produce search tool is changed, either by user action or programatically
    $scope.$watch('gtSearchTerm', function () {
        //Make sure the var and property are not undefined
        if (typeof $scope.gtSearchTerm !== 'undefined' && typeof $scope.gtSearchTerm.id !== 'undefined') {
            $scope.error.plant = false;
            //Pass to step 1
            $scope.addProduceStep2($scope.gtSearchTerm.id);
        }
    });

    //When the produce plant date calendar feature is changed, IE a date was added
    $scope.$watch('options.date', function () {
        //Make sure the var and property are not undefined
        if (typeof $scope.options.date !== 'undefined' && $scope.options.date !== '' && $scope.options.date !== null) {
            //Pass to step 1
            $scope.error.date = true;
        } else {
            $scope.error.date = false;
        }
    });
    
    //When the gtShared service is updated, update the label in the delete window
    $scope.$on('gtShared', function () {
        console.log(gtShared.params);
        //Update the label for use in the modal window
        $scope.delete = gtShared.params;
    });
  
    
  
  
    $scope.area = {
        /**
         * 
         * @returns {undefined}
         */
        add : function(){
            //Create default object
            var obj = {
                label: $scope.area.label,
                width: 12,
                length: 12
            };
            //Add the new area to the model
            gtGetData.activeGarden.addArea(obj);
            //Close modal window
            $('#gtModalArea').modal('hide');
        }
    };
    
   
   /**
    * Delete step 1, just closes the details window and opens the delete window
    * @returns {undefined}
    */
   $scope.deleteStep1 = function (){
       $('#gtModalDetails').modal('hide');
       $('#gtModalDelete').modal('show');
   };

   /**
    * Delete Step 2. Can delete either an area or a produce item
    * @returns {undefined}
    */
    $scope.deleteStep2 = function () {
        console.log(gtShared.params.type);
        //If this is a produce item
        if (gtShared.params.type === 'produce') {
            gtGetData.activeGarden.areas[gtShared.params.areaID].produce.splice(gtShared.params.produceID, gtShared.params.produceID + 1);
        //If this is an area
        } else if (gtShared.params.type === 'area') {
           gtGetData.activeGarden.areas.splice(gtShared.params.areaID, gtShared.params.areaID + 1);
        }

        $rootScope.$broadcast('dataPassed');
        $('#gtModalDelete').modal('hide');
    };

    /**
     * Create an object for the search tool to use
     * @param {type} id - The id of the produce item
     * @returns {undefined}
     */
    $scope.addProduceStep2 = function(id){
        //Add the ID to the add produce object
        $scope.addProduce.id = id;

        //Create the dropdown list needed by the type-ahead plugin
        //This is used for the produce search tool
        var searchProduce;
        if (gtGetData.produce[id].parent) {
            searchProduce = angular.copy(gtGetData.produce[gtGetData.produce[id].parent]);
            angular.merge(searchProduce, gtGetData.produce[id]);
        } else {
            searchProduce = angular.copy(gtGetData.produce[id]);
        }
        //Send the object to the search tool
        $scope.selection = searchProduce;


        $scope.dateRange = {};

        //Calcuate the earliest outdoor plant date
        if (moment.isMoment(gtGetData.activeGarden.frost_spring.date)) {
            $scope.dateRange.frost_spring   = gtGetData.activeGarden.frost_spring.date.format('MMMM Do');
            $scope.dateRange.warm_earliest  = gtGetData.activeGarden.frost_spring.date.clone().add(searchProduce.plantOutside, 'weeks').add(4, 'weeks').format('MMMM Do');
            $scope.dateRange.cold_earliest  = gtGetData.activeGarden.frost_spring.date.clone().add(searchProduce.plantOutside, 'weeks').format('MMMM Do');
        } else if(gtGetData.activeGarden.frost_spring === 'No Risk Of Frost'){
            $scope.dateRange.frost_spring   = 'No Risk Of Frost';
        } else {
            $scope.dateRange.frost_spring   = 'Not Set';
        }

        //Calculate the latest outdoor plant date
        if (moment.isMoment(gtGetData.activeGarden.frost_fall.date)) {
            $scope.dateRange.frost_fall     = gtGetData.activeGarden.frost_fall.date.format('MMMM Do');
            $scope.dateRange.warm_latest    = gtGetData.activeGarden.frost_fall.date.clone().subtract(searchProduce.maturity, 'day').subtract(4, 'weeks').format('MMMM Do');
            $scope.dateRange.cold_latest    = gtGetData.activeGarden.frost_fall.date.clone().subtract(searchProduce.maturity, 'day').format('MMMM Do');
        } else if(gtGetData.activeGarden.frost_fall === 'No Risk Of Frost'){
            $scope.dateRange.frost_fall     = 'No Risk Of Frost';
        } else {
            $scope.dateRange.frost_fall     = 'Not Set';
        }

        //Get the growing season length
        if(moment.isMoment(gtGetData.activeGarden.frost_spring.date) && moment.isMoment(gtGetData.activeGarden.frost_fall.date)){
             $scope.dateRange.growingseason = gtGetData.activeGarden.frost_fall.date.format('DDD') - gtGetData.activeGarden.frost_spring.date.format('DDD');
        }

    };


    /**
     * Adds the produce to the correct array
     * @returns {undefined}
     */
    $scope.addProduceStep3 = function(){
        if($scope.error.date === false){
            return false;
        }

        $scope.addProduce.plantDate = {
            month       : parseInt(moment($scope.options.date).format('M') - 1),
            date        : parseInt(moment($scope.options.date).format('D') - 1)
        };

        //Add the new produce to the area
        gtGetData.activeGarden.areas[gtShared.areaID].addProduce($scope.addProduce);
        $rootScope.$broadcast('dataPassed');

        //Hide modal window on click
        $('#gtModalAdd').modal('hide');
        //Now reset the window for the next produce
        $scope.addProduce = {};
        $scope.gtSearchTerm = '';
        $scope.selection = {};
    };


    //When the Add Area modal fires, automatically focus on the input
    $('#gtModalArea').on('shown.bs.modal', function () {
        $('#areaAdd').focus();
    });
    
    //When the Add Produce modal fires, automatically focus on the input
    $('#gtModalAdd').on('shown.bs.modal', function () {
       $('#gtProduceSearch input')[1].focus();
    });



});//end gtInteractive