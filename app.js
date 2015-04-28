if (process.env.NEW_RELIC_LICENSE_KEY) require('newrelic');

/**
 * Dependencies
 */
var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var mongoose = require('mongoose');

/**
 * Internal Dependencies
 */
require('./modules/planorequire');
var configurator = planorequire('modules/configurator');
var logger = planorequire('modules/logger');
var tasksRunner = planorequire('modules/tasks-runner');
var Utils = planorequire('modules/utils');

/**
 * Variables
 */
var isInitialized = false;

/**
 * Create application
 */
var app = express();

/**
 * Configure
 */
app.set('port', process.env.PORT || configurator.get('app', 'port'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

/**
 * Add custom response method
 */
app.use(planorequire('middlewares/add-responder'));

/**
 * Launch
 */
async.series([

  function(cb) {
    var options = configurator.get('mongo');
    return mongoose.connect(Utils.buildMongoPath(options), function(err) {
      if (err) return cb(err);
      logger.announce('Connected to Mongo database', options.name);
      return cb();
    });
  },

  function(cb) {
    return http.createServer(app).listen(app.get('port'), function(err) {
      if (err) return cb(err);
      logger.announce('Planorama example app listening on port', app.get('port'));
      return cb();
    });
  }

], function(err) {
  if (err) throw err;


  /**
   * Build models
   */
  configurator.get('app', 'models').forEach(function(modelName) {
    logger.info('Building model', modelName);
    return planorequire(path.join('models', modelName));
  });


  /**
   * Declare routes
   */
  configurator.get('app', 'routes').forEach(function(routeName) {
    logger.info('Loading route', routeName);
    return planorequire(path.join('routes', routeName))(app);
  });

  /**
   * After all middlewares
   */
  app.use(planorequire('middlewares/404'));
  app.use(planorequire('middlewares/error-handler'));
  app.use(app.router);


  /**
   * Schedule tasks
   */
  configurator.get('app', 'tasks').forEach(function(taskName) {
    logger.info('Launching task', taskName);
    return tasksRunner.registerTask(planorequire(path.join('tasks', taskName)));
  });


  /**
   * Application is ready to use
   */
  app.emit('ready');

});


/**
 * @module
 *
 * @callback callback
 */
module.exports = function(callback) {
  if (isInitialized) return callback(null, app);

  return app.on('ready', function(err) {
    if (err) return callback(err);
    isInitialized = true;
    return callback(null, app);
  });
};
