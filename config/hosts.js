var configurator = planorequire('modules/configurator');

var Config = {};

Config.all = {

};

Config.production = {
};

Config.staging = {
};

Config.dev = {
  ME: 'http://localhost:' + configurator.get('app', 'port')
};

Config['unit-test'] = {
  ME: 'http://localhost:' + configurator.get('app', 'port')
};

module.exports = Config;