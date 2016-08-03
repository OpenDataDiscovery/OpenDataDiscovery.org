var schedule = require('node-schedule');
var Promise = require('bluebird');
var pgp = require('pg-promise')({ promiseLib: Promise });
var logger = require('log4js').getLogger('scheduled');
var exec = require('child-process-promise').exec;
var Queue = require('promise-queue');

var crawler = require('./crawler/crawler.js');
var params = require('./crawler/src/params.js');
var generator = require('./tile-generator/generator.js');

Queue.configure(Promise);

var db = pgp(params.dbConnStr);

db.each('SELECT id, name, url, georeferenced, crawl_schedule FROM instance', [], function (instance) {
  schedule.scheduleJob(instance.crawl_schedule, function () {
    var queue = new Queue(1, Infinity, {
      onEmpty: function () {
        return crawler.refresh(null, db)
          .then(function () {
            return generator.preseed(instance.id);
          })
          .then(function () {
            return exec('pm2 restart odd.tile-server');
          })
          .then(function () {
            process.exit();
          });
      }
    });
    crawler.crawl(instance.name, instance.id, instance.url, instance.georeferenced, queue)
      .catch(function (err) {
        logger.error(err);
      });

  });
})
  .catch(function (err) {
    logger.error(err);
  });
