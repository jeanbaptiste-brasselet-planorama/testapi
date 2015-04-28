/**
 * Dependencies
 */
var _ = require('lodash');

module.exports = function(app) {

  app.get('/heartbeat', function(req, res) {
    return res.respond({
      data: _.extend({ now: new Date().toISOString(), uptime: process.uptime() }, process.memoryUsage())
    });
  });

};