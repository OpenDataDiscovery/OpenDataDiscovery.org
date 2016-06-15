var logger = require('log4js').getLogger('crawler');
var Promise = require('bluebird');
var pgp = require('pg-promise')({ promiseLib: Promise });

var params = require('./src/params.js');
var database = require('./src/database.js');

logger.info('Refreshing Database...');
database.refresh(pgp(params.dbConnStr));
