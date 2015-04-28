var Config = {};

Config.production = {
  name: 'plano-example-app'
};

Config.staging = {
  name: 'plano-example-app-staging'
};

Config.dev = {
  name: 'plano-example-app',
  port: 27017,
  host: 'localhost',
  user: null,
  password: null
};

Config['unit-test'] = {
  name: 'plano-example-app-test',
  port: 27017,
  host: 'localhost',
  user: null,
  password: null
};

/**
 * @module
 */
module.exports = Config;