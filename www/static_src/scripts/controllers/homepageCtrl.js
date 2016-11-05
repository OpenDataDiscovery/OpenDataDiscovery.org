import angular from 'angular';
import init from 'social-likes-next';
import 'social-likes-next/lib/social-likes_birman.css';

class homepageCtrl {

  constructor($scope, ajaxService, pageService) {
    'ngInject';

    this.pageService = pageService;
    this.datasetCount = 0;
    this.portalCount = 0;

    window.addEventListener('resize', () => {
      pageService.scrollTo(pageService.currentPage);
    });

    ajaxService.getInstanceSummary()
      .then(result => {
        this.datasetCount = result.summary.datasetCount;
      })
      .catch(err => {
        console.error(err);
      });

    // initialize social buttons
    let socialButtons = document.getElementsByClassName('social-likes')[0];
    init(socialButtons);

    /**
     * Modify the base url at base tag, source:
     * http://stackoverflow.com/questions/34317038/adding-base-tag-href-with-javascript-doesnt-work
     */

    // Fetch base element and href attribute
    let baseElement = document.getElementsByTagName('base')[0];
    let currentBaseHrefValue = baseElement.getAttribute('href');

    // Get correct domain value
    let urlForBase = window.location.href;
    let urlForBaseArr = urlForBase.split('/');
    let baseHrefUrl = urlForBaseArr[0] + '//' + urlForBaseArr[2] + '/' + currentBaseHrefValue;

    // Update base with domain to make it absolute for IE9 and IE10
    baseElement.setAttribute("href", baseHrefUrl);
  }

  scrollTo(elementID) {
    this.pageService.scrollTo(elementID);
  }

  openGitHubRepo() {
    this.pageService.openGitHubRepo();
  }
}

homepageCtrl.$inject = ['$scope', 'ajaxService', 'pageService'];

angular.module('OpenDataDiscovery').controller('homepageCtrl', homepageCtrl);

export default homepageCtrl;
