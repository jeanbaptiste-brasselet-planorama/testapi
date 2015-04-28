var supertest = require('supertest');

var app;

describe('/heartbeat', function() {

  before(function(done) {
    return planorequire('app')(function(err, server) {
      if (err) return done(err);
      app = server;
      return done();
    });
  });

  it('should respond 200', function(done) {
    return supertest(app)
      .get('/heartbeat')
      .expect(200, done);
  });

});