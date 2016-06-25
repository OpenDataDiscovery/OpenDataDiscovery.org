/**
 * import dependencies
 */
import angular from 'angular';
import 'angular-ui-bootstrap';
import 'angular-route';
import 'lodash';

require('../styles/app.less');

angular.module('OpenDataDiscovery', [
  'ui.bootstrap',
  'ngRoute'
])
.constant('_', window._)
.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'index.html',
    controller: 'oddCtrl'
  });

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});

function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('./services/', true, /\.js$/));
requireAll(require.context('./controllers/', true, /\.js$/));
requireAll(require.context('./directives/', true, /\.js$/));
