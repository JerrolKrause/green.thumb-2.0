/* global moment, angular */
/* jshint unused: true */

window.greenthumb = (function () {
    'use strict';

    var greenThumb = angular.module('gtApp', []);     //Angular app

    greenThumb.factory("gtGetData", function ($http, $rootScope) {
        
        var data = {
            params              : {                     //Holds application parameters
                dates          : (function(){
                    var today = moment();
                    var obj = {
                        main        : today.clone(), //This is the user adjustable date
                        main_pos    : Math.round((((today.format("M") - 1) * 8.333) + ((today.format("D") / today.daysInMonth()) * 8.333)) * 10) / 10,
                        today       : today, //Always holds todays date
                        today_pos   : Math.round((((today.format("M") - 1) * 8.333) + ((today.format("D") / today.daysInMonth()) * 8.333)) * 10) / 10
                    };
                    console.log(obj);
                    return obj;
                })()
            },                   
            gardens                 : [],                   //Contains all the gardens currently created
            activeGarden            : {},                   //References currently active garden
            produce                 : window.gtProduce      //Holds produce content
        };
        
        //Create new instances
        data.create = {
            
            /**
             * Creates a new garden object
             * @param {type} garden
             * @returns {undefined}
             */
            garden: function (garden) {
                var self            = this;
                //Load this garden's attributes
                self.label          = garden.label;
                
                //Set the spring frost date and position
                self.frost_spring   = {
                    date            : moment().set('month', garden.options.frost_spring.month).set('date', garden.options.frost_spring.date)
                };
                self.frost_spring.position = Math.floor(self.frost_spring.date.format('DDD') * 100 / 365 * 10) / 10;
                
                //Set the fall frost date and position
                self.frost_fall     = {
                    date            : moment().set('month', garden.options.frost_fall.month).set('date', garden.options.frost_fall.date)
                };
                self.frost_fall.position     = Math.floor((365 - self.frost_fall.date.format('DDD')) * 100 / 365 * 10) / 10;
                        
                //Set the zone        
                self.zone           = garden.options.zone;
                
                //Create container to hold the areas
                self.areas          = [];
                //Set the active/viewable garden to this garden, the newest created garden will always be referenced first
                data.activeGarden   = self;
                
                //If this garden has areas, load them up
                if(garden.areas.length > 0){
                    angular.forEach(garden.areas, function(value){
                        var area = new  data.create.area(value);
                        self.areas.push(area);
                    });
                }
            },//end create.garden
            
            /**
             * Create a new area object
             * @param {type} area
             * @returns {undefined}
             */
            area : function(area){
                var self            = this;
                //Load area arguments
                self.label          = area.label;
                self.width          = area.width;
                self.length         = area.length;
                self.produce        = [];
                
                 //If this area has produce, load them up
                if(area.produce.length > 0){
                    angular.forEach(area.produce, function(value){
                        var produce = new  data.create.produce(value);
                        self.produce.push(produce);
                    });
                }
            },
            
            /**
             * Create a new produce object
             * @param {type} produce
             * @returns {undefined}
             */
            produce : function(produce){
                var content;
                //Check if this produce item has a parent
                if ('parent' in data.produce[produce.id]){
                    //Get the parent ID
                    var parentID = data.produce[produce.id].parent;
                    //Copy the content from the parent produce object
                    content = angular.copy(data.produce[parentID]);
                    //Now overwrite any of the default parent content with the child produce content
                    content = angular.extend(content, data.produce[produce.id]);
                    //Set image class
                    content.img = parentID;
                //If this item does not have a parent    
                } else {
                    //Just load the content right in
                    content = angular.copy(data.produce[produce.id]);
                    //Set image class
                    content.img = produce.id;
                }
                
                //Figure out this produce items set dates
                var plantMe = moment().set('month', produce.plantDate.month).set('date', produce.plantDate.date);
                content.dates = {
                    seedlings           : plantMe.clone().subtract(content.seedling, 'weeks'),
                    plant               : plantMe,
                    harvest_start       : plantMe.clone().add(content.maturity, 'days'),
                    harvest_complete    : plantMe.clone().add((content.harvest * 7) + content.maturity, 'days')
                };
                
                //Create parameters needed by the DOM elements, used for width and positioning of calendar items
                content.dom = {
                    wSeedlings          : Math.round(content.seedling * 7 * 100 / 365 * 10) / 10 + 1,
                    wGrowing            : Math.round(content.maturity * 100 / 365 * 10) / 10,
                    wHarvesting         : Math.round(content.harvest * 7 * 100 / 365 * 10) / 10 + 1,
                    pSeedlings          : Math.round((((content.dates.seedlings.format("M") - 1) * 8.333) + ((content.dates.seedlings.format("D") / content.dates.seedlings.daysInMonth()) * 8.333)) * 10) / 10,
                    pGrowing            : Math.round((((content.dates.plant.format("M") - 1) * 8.333) + ((content.dates.plant.format("D") / content.dates.plant.daysInMonth()) * 8.333)) * 10) / 10,
                    pHarvesting         : Math.round((((content.dates.harvest_start.format("M") - 1) * 8.333) + ((content.dates.harvest_start.format("D") / content.dates.harvest_start.daysInMonth()) * 8.333)) * 10) / 10 - 1
                };
                
                //Set the value of this produce entry to the content
                return content;
            }
            

        };//end create
        
        //Fetch JSON object of garden to use
        //This call will be replaced by a CMS when that component is ready
        $http({
            method: 'GET',
            url: 'js/model.js'
        }).then(function ($response) {
            
            //Create a new instance of garden
            var garden = new  data.create.garden($response.data[0]);
            //Add this garden to the gardens array
            data.gardens.push(garden);
            $rootScope.$broadcast('dataPassed');
        });
        
        return data;
    });
    
    
    greenThumb.controller('gtSchedule', function ($scope, gtGetData) {
        $scope.$on('dataPassed', function () {
            
        });
    });
    
    
    greenThumb.controller('gtCalendar', function ($scope, gtGetData) {
        $scope.$on('dataPassed', function () {
            $scope.garden           = gtGetData.activeGarden.areas;
            $scope.label            = gtGetData.activeGarden.label;
            $scope.frost_spring     = gtGetData.activeGarden.frost_spring.position;
            $scope.frost_fall       = gtGetData.activeGarden.frost_fall.position;
            
            $scope.main_pos         = gtGetData.params.dates.main_pos;
            $scope.today_pos        = gtGetData.params.dates.today_pos;
            
            console.log(gtGetData.activeGarden);
        });
        
        
    }).directive('areas', function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            templateUrl: 'partials/calendar-row.html'
           };
    });

   
    return greenThumb;
})();