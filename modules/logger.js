var NOOT = require('noot')('logger');

module.exports = NOOT.Logger.create({ level: planorequire('modules/configurator').get('app', 'logging') });