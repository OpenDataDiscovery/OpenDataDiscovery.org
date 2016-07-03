var ckan = require('./ckan.js');
var Promise = require('bluebird');
var logger = require('log4js').getLogger('worker');
var Queue = require('promise-queue');
var _ = require('lodash');
var ProgressBar = require('progress');
var database = require('./database.js');
var pgp = require('pg-promise')({ promiseLib: Promise });
var params = require('./params.js');
var sprintf = require('sprintf-js').sprintf;

Queue.configure(Promise);

exports.spatialCrawl = function(instanceName, instanceID, instanceUrl) {

  var db = pgp(params.dbConnStr);
  var sql = 'SELECT region_id, Box2D(bbox) AS bbox FROM view_instance_region WHERE instance_id = $1';

  return db.any(sql, instanceID)
  .then(function(regions) {
    if (regions.length < 1) { return Promise.reject('no regions'); }

    var taskQueue = new Queue(1, Infinity);
    var bar = new ProgressBar(sprintf('Crawling %s: [:bar] :current/:total', instanceName), regions.length);

    _.forEach(regions, function(region) {
      taskQueue.add(function() {
        var match = region.bbox.match(/BOX\(([-.0-9]+) ([-.0-9]+),([-.0-9]+) ([-.0-9]+)\)/);
        var bbox = _.chain(match).slice(1, 5).map(_.toNumber).value();

        return ckan.getFullMetadata(instanceUrl, {
          extras: { ext_bbox: bbox }
        })
        .then(function(data) {
          return db.tx(function(t) {
            return database.saveData(t, instanceID, region.region_id, data);
          });
        })
        .then(function() {
          bar.tick();
        })
        .catch(function(err) {
          logger.error(err);
        });
      });
    });
  })
  .catch(function(err) {
    switch (err) {
      case 'no region':
        logger.info('No region is found for instance: ', instanceID);
        return Promise.resolve();
      default:
        logger.warn('Failed to fetch data from ' + instanceUrl);
        logger.error(err);
    }
  });
};

exports.crawl = function(instanceName, instanceID, instanceUrl) {
  logger.info('Crawling ' + instanceName + '...');

  var db = pgp(params.dbConnStr);
  var sql = [
    'SELECT region_id FROM instance_region_xref AS irx',
    'LEFT JOIN instance_region_level as irl ON irl.id = irx.instance_region_level_id',
    'WHERE irx.instance_id = $1 AND irl.level = 0'
  ].join(' ');

  var regionID;

  return db.one(sql, instanceID)
    .then(function(result) {
      regionID = result.region_id;
      return ckan.getFullMetadata(instanceUrl);
    })
    .then(function(data) {
      return db.tx(function(t) {
        return database.saveData(t, instanceID, regionID, data);
      });
    })
    .catch(function(err) {
      logger.error(err);
      return Promise.resolve();
    });
};
