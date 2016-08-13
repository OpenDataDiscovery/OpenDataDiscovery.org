import angular from 'angular';

class mapCtrl {

  constructor($scope, ajaxService, mapService) {
    'ngInject';

    this.datasets = 0;

    $scope.$on('map:ready', () => {
      ajaxService.getInstanceSummary()
        .then(result => {
          this.datasets = result.summary.count;
        });
    });

    mapService.initialize();
  }
}

mapCtrl.$inject = ['$scope', 'ajaxService', 'mapService'];

angular.module('OpenDataDiscovery').controller('mapCtrl', mapCtrl);

export default mapCtrl;
