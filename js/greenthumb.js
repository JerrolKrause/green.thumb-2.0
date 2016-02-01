/* global moment, angular */
/* jshint unused: true */

window.greenthumb = (function () {
    'use strict';

    var greenThumb = angular.module('gtApp', ['ngRoute', 'ui.bootstrap']);     //Angular app

    greenThumb.factory("gtGetData", function ($http, $rootScope) {

        var data = {
            params                  : {                      //Holds application parameters
                dates               : (function(){           //Generates the main dates used by the app
                    var today       = moment();
                    var obj = {
                        main        : today.clone(),        //This is the user adjustable date
                        main_pos    : Math.round((((today.format("M") - 1) * 8.333) + ((today.format("D") / today.daysInMonth()) * 8.333)) * 10) / 10,
                        today       : today,                //Always holds todays date
                        today_pos   : Math.round((((today.format("M") - 1) * 8.333) + ((today.format("D") / today.daysInMonth()) * 8.333)) * 10) / 10
                    };
                    return obj;
                })()
            },                   
            gardens                 : [],                   //Contains all the gardens currently created
            activeGarden            : {},                   //References currently active garden
            produce                 : window.gtProduce      //Holds produce content
        };
        
        //data.params.dates.main = moment().set({year: 2016, month: 3, date: 1, hours: 0});
       
        //Create new instances
        data.create = {
            
            
            /**
             * Creates a new garden object
             * @param {type} garden - Garden JSON object
             * @returns {undefined}
             */
            garden: function (garden) {
                var self            = this;
                //Load this garden's attributes
                self.label          = garden.label;
                self.plantOnSat     = garden.options.plantOnSat;
                self.capHarvest     = garden.options.capHarvest;
                
                //Check if the frost_spring date is present and has been set
                if (angular.isDefined(garden.options.frost_spring) && angular.isDefined(garden.options.frost_spring.month)) {
                    //Set the spring frost date and position
                    self.frost_spring = {
                        date: moment().set('month', garden.options.frost_spring.month).set('date', garden.options.frost_spring.date)
                    };
                    self.frost_spring.position = Math.floor(self.frost_spring.date.format('DDD') * 100 / 365 * 10) / 10;
                } else {
                    self.frost_spring = 'Not Set';
                }
                
                //Check if the frost_fall date is present and has been set
                if (angular.isDefined(garden.options.frost_fall) && angular.isDefined(garden.options.frost_fall.month)) {
                    //Set the fall frost date and position
                    self.frost_fall = {
                        date: moment().set('month', garden.options.frost_fall.month).set('date', garden.options.frost_fall.date)
                    };
                    self.frost_fall.position = Math.floor((365 - self.frost_fall.date.format('DDD')) * 100 / 365 * 10) / 10;
                } else {
                    self.frost_fall = 'Not Set';
                }
                    
                //Set the zone        
                self.zone           = garden.options.zone || 'Not Set';
                
                //Create container to hold the areas
                self.areas          = [];
                
                self.tasks          = {};
                
                //Set the active/viewable garden to this garden, the newest created garden will always be referenced first
                data.activeGarden   = self;
                
                /**
                 * Creates a new area for this garden
                 * This is created on a garden level which allows us to trickle up information from the area level
                 * @param {type} areaObj
                 * @returns {undefined}
                 */
                self.addArea = function(areaObj){
                    var area = new data.create.area(areaObj);
                    self.areas.push(area);
                };
                
                //If this garden has areas on load, create them automatically
                if(garden.areas.length > 0){
                    angular.forEach(garden.areas, function(value){
                        self.addArea(value);
                    });
                }
                
                return self;
            },//end create.garden
            
            
            /**
             * Create a new area object
             * @param {obj} area - The area object specified by the user model
             * @returns {undefined}
             */
            area : function(area){
                var self            = this;
                //Load area arguments
                self.label          = area.label;
                self.width          = area.width;
                self.length         = area.length;
                self.produce        = [];               //Holds all the produce objects
                self.seasons        = {                 //Holds the seasons flag. This will tell us what seasons are planted in this bed for filtering. Sets default to false
                    spring  :   false,
                    summmer :   false,
                    fall    :   false,
                    winter  :   false
                }; 
                
                /**
                 * Adds a new produce item to this area
                 * Having a closure allows us to trickle up information from the produce to the area level
                 * @param {type} produceObj
                 * @returns {undefined}
                 */
                self.addProduce = function (produceObj) {
                    var produce = new data.create.produce(produceObj);
                    //Add new produce item to the produce array
                    self.produce.push(produce);
                    //Update this area's season flag to true to make filtering possible on an area level
                    self.seasons[produce.season] = true;
                };
                
                //If this area has produce on default load, create all the entries
                if(area.produce.length > 0){
                    angular.forEach(area.produce, function(value){
                        self.addProduce(value);
                    });
                }
                
                return self;
            },//end create.area
            
            
            /**
             * Create a new produce object
             * @param {obj} produce - A user specified produce object from the model
             * @returns {undefined} - The fully generated produce file
             */
            produce : function(produce){
                var self = this;
                
                //Check if this produce item has a parent
                if ('parent' in data.produce[produce.id]){
                    //Get the parent ID
                    var parentID = data.produce[produce.id].parent;
                    //Copy the content from the parent produce object
                    //self = angular.copy(data.produce[parentID]);
                    angular.extend(self, data.produce[parentID]);
                    //Now overwrite any of the default parent content with the child produce content
                    self = angular.extend(self, data.produce[produce.id]);
                    //Set image class
                    self.img = parentID;
                    self.label_parent = data.produce[parentID].label;
                //If this item does not have a parent    
                } else {
                    //Just load the content right in
                    //self = angular.copy(data.produce[produce.id]);
                     angular.extend(self, data.produce[produce.id]);
                    //Set image class
                    self.img = produce.id;
                }
                
                self.id = produce.id;
                self.seedling = parseInt(self.plantOutside) - parseInt(self.plantInside);
                self.label_short = self.label.charAt(0) + self.label.charAt(1);
                self.numPlants = produce.numPlants;
                //Figure out this produce items set dates
                var plantMe = moment().set('month', produce.plantDate.month).set('date', produce.plantDate.date);
                
                //If the plant on sat flag has been set, round the plant date to the nearest Saturday
                if(data.activeGarden.plantOnSat === true){
                    plantMe.day("Saturday");
                }
                
                
                self.dates = {
                    seedlings           : plantMe.clone().subtract(self.seedling, 'weeks'),
                    plant               : plantMe,
                    harvest_start       : plantMe.clone().add(self.maturity, 'days'),
                    harvest_complete    : plantMe.clone().add((self.harvest * 7) + self.maturity, 'days')
                };
                
                //Create parameters needed by the DOM elements, used for width and positioning of calendar items
                self.dom = {
                    wSeedlings          : Math.round(self.seedling * 7 * 100 / 365 * 10) / 10 + 1,
                    wGrowing            : Math.round(self.maturity * 100 / 365 * 10) / 10,
                    wHarvesting         : Math.round(self.harvest * 7 * 100 / 365 * 10) / 10 + 1,
                    pSeedlings          : Math.round((((self.dates.seedlings.format("M") - 1) * 8.333) + ((self.dates.seedlings.format("D") / self.dates.seedlings.daysInMonth()) * 8.333)) * 10) / 10,
                    pGrowing            : Math.round((((self.dates.plant.format("M") - 1) * 8.333) + ((self.dates.plant.format("D") / self.dates.plant.daysInMonth()) * 8.333)) * 10) / 10,
                    pHarvesting         : Math.round((((self.dates.harvest_start.format("M") - 1) * 8.333) + ((self.dates.harvest_start.format("D") / self.dates.harvest_start.daysInMonth()) * 8.333)) * 10) / 10 - 1
                };
                
                //Figure out what season for this produce object is planted in
                //Spring Planting
                if (self.dates.plant.isBetween(moment().month('March').subtract(1, 'month'), moment().month('May').date(31).add(1, 'month'), 'month')) {
                    self.season = 'spring';
                    //Summer Planting    
                } else if (self.dates.plant.isBetween(moment().month('June').subtract(1, 'month'), moment().month('August').date(31).add(1, 'month'), 'month')) {
                    self.season = 'summer';
                    //Fall Planting    
                } else if (self.dates.plant.isBetween(moment().month('September').subtract(1, 'month'), moment().month('November').date(30).add(1, 'month'), 'month')) {
                    self.season = 'fall';
                    //Winter Planting    
                } else if (self.dates.plant.isBetween(moment().month('November').subtract(1, 'month'), moment().month('February').add(1, 'month').add(1, 'year'), 'month') || self.dates.plant.isBetween(moment().month('January').subtract(1, 'month'), moment().month('Feb').add(1, 'month'), 'month')) {
                    self.season = 'winter';
                }
                
                self.plantInsideWarm = self.plantInside + 4;
                self.plantOutsideWarm = self.plantOutside + 4;
                        
                
                data.create.tasks(self);
                //Set the value of this produce entry to the content
                return self;
            },//end create.produce
            
            
            /**
             * 
             * @param {type} produce
             * @returns {undefined}
             */
            tasks : function(produce){
                //console.log(produce);
                
                angular.forEach(produce.dates, function(value,key){
                    var str;

                    //Figure out which activity type this is, set appropriate string for output in task pane
                    switch (key) {
                        case 'seedlings':
                            str = 'Start seedlings for ' ;
                            if (produce.directSow === true) {
                                str = 'Direct sow ' + produce.plantCount + ' ' + produce.label + ' ' + produce.label_parent + ' seeds';
                            }
                            break;
                        case 'plant':
                            str = 'Plant ';
                            break;
                        case 'harvest_start':
                            str = 'Start harvesting ';
                            break;
                        case 'harvest_complete':
                            str = 'Complete harvesting ';
                            break;
                    }
                    
                    if(produce.numPlants){
                        str += produce.numPlants + ' ';
                    }
                    
                    str +=  produce.label + ' ';
                    
                    if(produce.label_parent){
                        str += produce.label_parent ;
                    }
                    
                    if (!angular.isObject(data.activeGarden.tasks[value.format("YYYYMMDD")])) {
                        data.activeGarden.tasks[value.format("YYYYMMDD")] = {
                            label: value.format("dddd, MMMM Do"),
                            items: [],
                            date : value
                        };
                    }
                    
                    data.activeGarden.tasks[value.format("YYYYMMDD")].items.push(str);
                });
            }
        };//end create
       
       
        data.load = function (url) {
            //Fetch JSON object of garden to use
            //This call will be replaced by a CMS when that component is ready
            $http({
                method  : 'GET',
                url     : url
            }).then(function ($response) {
                //Create a new instance of garden
                var garden = new data.create.garden($response.data[0]);
                //Add this garden to the gardens array
                data.gardens.push(garden);
                $rootScope.$broadcast('dataPassed');
            });
        };
        
        /**
         * 
         * @param {type} params
         * @returns {undefined}
         */
        data.update = function(params){
            
            //Overwrite any parameters supplied by the input object
            angular.merge(data.params, params);
            
            data.params.dates.main_pos = Math.round((((data.params.dates.main.format("M") - 1) * 8.333) + ((data.params.dates.main.format("D") / data.params.dates.main.daysInMonth()) * 8.333)) * 10) / 10;
            
            //Now rebuild the appropriate items in the garden
            $rootScope.$broadcast('dataPassed');
        };
       
        return data;
    });
    
    
    /**
     * Handle meta content shared between controllers
     */
    greenThumb.controller('gtMeta', function ($scope, gtGetData) {
        $scope.$on('dataPassed', function () {
            $scope.name     = gtGetData.activeGarden.label;
            $scope.title    = gtGetData.activeGarden.label + ' | ' + 'green.thumb';
            
        });
    });
    
    
    /**
     * Manage the filtering/sorting behavior
     */
    greenThumb.controller('gtFilter', function ($scope, gtGetData) {

        //Needed by calendar dropdown
        $scope.open     = function ($event) { $scope.status.opened = true;};
        $scope.status   = {opened: false};
        $scope.date     = new Date();

        $scope.$on('dataPassed', function () {
            //Update the date from the factory
            //$scope.date = gtGetData.params.dates.main.toDate();
        });

        /**
         * When filter sorting params have been adjusted
         * @param {type} params
         * @returns {undefined}
         */
        $scope.filterSort = function(params){
            var params = {
                dates : {
                    main : moment($scope.date)
                }
            };
            
            gtGetData.update(params);
        };

    });
    
    
    
    /**
     * Manage the garden behavior
     */
    greenThumb.controller('gtGarden', function ($scope, gtGetData, $routeParams) {
        $scope.Math = window.Math;
        $scope.gardenID = $routeParams.gardenID;
        $scope.taskpanel = 'next';
        
        if($scope.gardenID !== 'mine'){
            gtGetData.load('js/models/'+$scope.gardenID+'.js');
        };
        
       
        /*
         * Fires a modal window that contains the specific plant characteristics
         * @param {type} plantID
         * @returns {undefined}
         */
        $scope.gtDetails = function(produce){
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
        
        
        
        $scope.$on('dataPassed', function () {
           
            
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
                if (value.date.isBetween(gtGetData.params.dates.main.add(1, 'day'), gtGetData.params.dates.main.clone().add(1, 'month'))) {
                    $scope.tasksNext.push(value);
                    //Check if previous task object occurs 1 month prior    
                } else if (value.date.isBetween(gtGetData.params.dates.main.clone().subtract(1, 'month'), gtGetData.params.dates.main)) {
                    $scope.tasksPrev.push(value);
                }
            });

            //console.log(gtGetData.activeGarden.tasks);
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
            templateUrl: 'partials/calendar-row.html',
            controller: 'gtGarden'
        };
    });
     
     
     
     /**
      * Manage URL routing for the single page app
      */
    greenThumb.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.
                    when('/', {
                        templateUrl: 'partials/home.html'
                    }).
                    when('/about/', {
                        templateUrl: 'partials/about.html'
                    }).
                    when('/contact/', {
                        templateUrl: 'partials/contact.html'
                    }).
                    when('/garden/:gardenID/', {
                        templateUrl: 'partials/garden.html'
                    }).
                    when('/garden/', {
                        templateUrl: 'partials/garden.html'
                    }).
                    otherwise({
                        //redirectTo: '/home'
                        templateUrl: 'partials/home.html'
                    });
        }]);

   
    return greenThumb;
})();