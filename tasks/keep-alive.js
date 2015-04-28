/**
 * Dependencies
 */
var NOOT = require('noot')('url', 'time', 'tasks-runner');
var request = require('request');
var configurator = planorequire('modules/configurator');
var logger = planorequire('modules/logger');

/***********************************************************************************************************************
 * Keep-alive
 ***********************************************************************************************************************
 *
 * @info Fight against Heroku auto shutdown
 *
 **********************************************************************************************************************/
var task = NOOT.TasksRunner.Task.create({

  cronPattern: '0 0 * * * *',

  /**
   * launch
   */
  job: function(done) {
    return request({
      method: 'GET',
      uri: NOOT.Url.join(configurator.get('hosts').ME, 'heartbeat')
    }, done);
  }

});

task.on('error', function(err) {
  logger.error('Error when trying to wake up server', err);
});

task.on('done', function() {
  logger.info('Waked up server');
});

/**
 * @module
 */
module.exports = task;