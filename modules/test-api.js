var NOOT = require('noot')('object');
var async = require('async');
var request = require('request');
var fs = require('fs');
var logger = planorequire('modules/logger');
var configurator = planorequire('modules/configurator');

var testApi = NOOT.Object.extend({

  type: '',
  form: null,
  headers: {
    'Authorization': 'Login itg_api_test:W4NRrUUErPChgCU4'
  },

  getExportId: function(callback) {
    var headers = this.headers;
    headers['Content-type'] = 'application/json';
    var options = {
      url: testApi.apiUrl + this.type,
      headers: headers,
      form: this.form
    };
    logger.warn('request post : ' + options.url);
    logger.trace(options);
    request.post(options, function(err, res, body) {
      if (err) return callback(err);
      var parsedBody = JSON.parse(body);
      logger.warn('response body');
      logger.trace(parsedBody);
      return callback(null, parsedBody.data._id);
    });
  },

  getLinksFragment: function(id, callback) {
    var options = {
      url: testApi.apiUrl + id,
      headers: this.headers
    };
    logger.warn('request get : ' + options.url);
    logger.trace(options);
    request.get(options, function(err, res, body) {
      if (err) return callback(err);
      var parsedBody = JSON.parse(body);
      logger.warn('response body');
      logger.trace(parsedBody);
      return callback(null, parsedBody.data);
    });
  },

  downloadFragment: function(urls, callback) {
    var self = this;
    var regexp = /inline; filename=\"(.*)\"/gi;
    logger.warn('download files');
    async.eachSeries(urls, function(url, cb) {
      logger.announce(url);
      var options = {
        url: url,
        headers: self.headers
      };
      logger.trace(options);
      var r = request.get(options);

      r.on('end', function() {
        logger.info('download completed');
      });

      r.on('error', function(err) {
        logger.error('Error during file download : ' + err);
        return callback(err);
      });

      r.on('response',  function (res) {
        var filename = res.headers['content-disposition'].replace(regexp, '$1');
        var stream = fs.createWriteStream(filename);
        r.pipe(stream);
        logger.info('download begin');
        stream.on('finish', cb);
        stream.on('error', function(err) {
          logger.error(err);
          return cb(err);
        });
      });
    }, function(err) {
      if (err) return callback(err);
      logger.warn('DONE');
      return callback();
    });
  },

  run: function(done) {
    var self = this;
    return this.getExportId(function(err, id) {
      if (err) return done(err);
      return self.getLinksFragment(id, function(err, urls) {
        if (err) return done(err);
        return self.downloadFragment(urls, done);
      });
    });
  }

}, {

  apiUrl: configurator.get('app', 'apiUrl')

});

module.exports = testApi;