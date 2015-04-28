/**
 * Dependencies
 */
var _ = require('lodash');
var NOOT = require('noot')();

module.exports = function(req, res, next) {

  res.respond = function(options, status) {
    var statusCode;
    var json;


    switch (arguments.length) {
      case 2:
        if (NOOT.isNumber(options)) {
          statusCode = options;
          json = status;
        } else {
          statusCode = status;
          json = options;
        }
        break;
      case 1:
        if (NOOT.isNumber(options)) {
          statusCode = options;
          json = {};
        } else {
          json = options;
        }
        break;
    }

    if (!statusCode) statusCode = 200;
    if (!json) json = {};

    res.status(statusCode);
    return res.json(_.pick(json, ['message', 'data', 'code', 'error']));
  };

  return next();
};