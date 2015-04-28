var app;
var supertest = require('supertest');

describe('/user', function() {

  before(function(done) {
    return planorequire('app')(function(err, server) {
      if (err) return done(err);
      app = server;
      return done();
    });
  });

  it('should create a user', function(done) {
    supertest(app)
      .post('/user')
      .send({ name: { first: 'John', last: 'Doe' }, email: 'john.doe@planorama.com' })
      .expect(201, done);
  });

  it('should not create a user (missing email)', function(done) {
    supertest(app)
      .post('/user')
      .send({ name: { first: 'John', last: 'Doe' } })
      .expect(500, done);
  });

  it('should not create a user (malformed email)', function(done) {
    supertest(app)
      .post('/user')
      .send({ name: { first: 'John', last: 'Doe' }, email: 'john.doe' })
      .expect(500, done);
  });

});