var _ = require('lodash');
var Promise = require('bluebird');
var pgp = require('pg-promise')({ promiseLib: Promise });
var sprintf = require('sprintf-js').sprintf;
var logger = require('log4js').getLogger('');

var params = require('../../config/params.js');

exports.getInstances = function(req, res) {
  var response = { success: true };
  var db = pgp(params.dbConnStr);
  var sql = [
    'SELECT i.name, url,',
    'json_agg(json_build_object(\'level\', level_name, \'name\', layer_name) ORDER BY level) AS layers',
    'FROM view_vector_tile_layer AS vvtl, instance AS i',
    'WHERE vvtl.instance_id = i.id GROUP BY i.name, url'
  ].join(' ');

  db.any(sql)
    .then(function(results) {
      _.forEach(results, function(instance) {
        _.forEach(instance.layers, function(layer) {
          layer.url = sprintf(params.vtRequestUrl.external, layer.name);
        });
      });

      response.instances = results;
      res.send(response);
    })
    .catch(function(err) {
      logger.error(err);

      response.message = 'Unable to get instacne information';
      res.status(500).send(response);
    });
};
