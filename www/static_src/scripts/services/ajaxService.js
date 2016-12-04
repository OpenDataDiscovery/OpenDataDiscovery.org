import angular from 'angular';
import _ from 'lodash';

class ajaxService {

  constructor($http, $location) {
    'ngInject';

    this.$location = $location;
    this.$http = $http;
  }

  /**
   * Get current base url.
   * @return {string} base url
   */
  getBaseUrl() {
    return this.$location.host();
  }

  /**
   * Get CKAN instance information list
   * @return {object} response object
   */
  getInstances() {
    return this.$http
      .get('/api/instances')
      .then(result => {
        return result.data;
      });
  }

  /**
   * Get a summary of instances
   * @return {object} response object
   */
  getInstanceSummary() {
    return this.$http
      .get('/api/instances/summary')
      .then(result => {
        return result.data;
      });
  }

  /**
   * Get style definition.
   * @param  {integer} count   number of style classes
   * @return {object[]}             styles
   */
  getMapStyles(count) {
    return this.$http
      .get(`/api/map_styles/${count}`)
      .then(result => {
        return result.data;
      });
  }

  /**
   * [getInstanceInfo description]
   * @param  {integer} instanceID instance ID
   * @return {object}             instance info
   */
  getInstanceInfo(instanceID) {
    return this.$http
      .get(`/api/instance/${instanceID}`, {
        cache: true
      })
      .then(result => {
        return result.data;
      });
  }

  exportData(date, format) {
    let url = '/api/export';
    let params = {};

    if (_.isDate(date)) {
      let today = new Date();

      if (today.getFullYear() !== date.getFullYear() ||
          today.getMonth() !== date.getMonth() ||
          today.getDate() !== date.getDate()) {
        params.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      }
    }

    if (format) {
      params.format = format;
    }

    return this.$http.get(url, {
      params: params
    })
    .then(result => {
      return result.data;
    });
  }
}

ajaxService.$inject = ['$http', '$location'];

angular.module('OpenDataDiscovery').service('ajaxService', ajaxService);

export default ajaxService;
