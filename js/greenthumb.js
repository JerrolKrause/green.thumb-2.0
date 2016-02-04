/* global moment, angular */
/* jshint unused: true */

window.greenthumb = angular.module('gtApp', ['ngRoute', 'ui.bootstrap']);     //Angular app
'use strict';

greenthumb.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
                when('/', {
                    templateUrl: 'pages/home.html'
                }).
                when('/about/', {
                    templateUrl: 'pages/about.html'
                }).
                when('/contact/', {
                    templateUrl: 'pages/contact.html'
                }).
                when('/garden/:gardenID/', {
                    templateUrl: 'partials/garden.html'
                }).
                when('/garden/', {
                    templateUrl: 'partials/garden.html'
                }).
                otherwise({
                    //redirectTo: '/home'
                    templateUrl: 'pages/home.html'
                });
    }]);//end $routeProvider