/**
 * Dependencies
 */
var NOOT = require('noot')('error');
var logger = planorequire('modules/logger');


/* jshint unused:false */
module.exports = function(err, req, res, next) {
  // Keep a trace
  logger.error(err);

  // Define response's properties
  var json = err instanceof NOOT.Error ?
             err.toJSON() :
             { error: true, message: err.message, code: 'InternalServerError' };

  return res.respond(err.statusCode || 500, json);
};
/* jshint unused:true */