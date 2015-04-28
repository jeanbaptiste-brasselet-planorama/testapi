/**
 * Dependencies
 */
var NOOT = require('noot')('namespace');


var Utils = NOOT.Namespace.create({

  /**
   * Build a valid uri from an object
   *
   * @param {Object} options
   * @returns {String}
   */
  buildMongoPath: function(options) {
    var auth = '';
    if (options.user) auth = [options.user, ':', options.password, '@'].join('');
    return ['mongodb://', auth, options.host, ':', options.port, '/', options.name].join('');
  }

});


/**
 * @module
 */
module.exports = Utils;