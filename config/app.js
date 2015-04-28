var Config = {};

Config.all = {
  port: 8891,
  routes: ['index', 'heartbeat'],
  tasks: ['keep-alive'],
  models: [],
  apiUrl: 'http://api-test.planorama.com/itg/v1/outbound/'
};

Config.production = {
  logging: 'info'
};

Config.staging = {
  logging: 'debug'
};

Config.dev = {
  logging: 'trace'
};

Config['unit-test'] = {
  logging: 'off'
};

module.exports = Config;