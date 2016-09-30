const assert = require('assert');
const request = require('request');
const binstaface = require('../lib');

describe('my app test', function() {
  const PORT = 4455;
  
  let server, app;

  // Create a request instance with defaults
  const req = request.defaults({
    baseUrl: `http://localhost:${PORT}/messages`,
    json: true
  });

  before(function(done) {
    app = binstaface();
    server = app
      .listen(PORT, () => {
        req({
          url: '/',
          method: 'post',
          body: { id: 1, text: 'A test message' }
        }, error => done(error));
      });
  });

  after(function(done) {
    server.close(() => done());
  });

  describe('messages service', function() {
    it('GET / lists all messages', function(done) {
      req('/', (error, res, body) => {
        assert.deepEqual(body, [{
          id: 1,
          text: 'A test message'
        }]);
        done(error);
      });
    });

    it('GET /:id returns a single message', function(done) {
      req('/1', (error, res, body) => {
        assert.deepEqual(body, {
          id: 1,
          text: 'A test message'
        });
        done(error);
      });
    });

    it('POST / creates a new message', function(done) {
      const text = 'Created message';

      req({
        url: '/',
        method: 'post',
        body: { id: 2, text }
      }, (error, res, body) => {
        assert.deepEqual(body, { id: 2, text });
        done(error);
      });
    });

    it('PATCH /:id extends a message', function(done) {
      req({
        url: '/1',
        method: 'patch',
        body: { tested: true }
      }, (error, res, body) => {
        assert.deepEqual(body, {
          id: 1,
          text: 'A test message',
          tested: true
        });
        done(error);
      });
    });

    it('DELETE /:id removes a message', function(done) {
      req({
        url: '/1',
        method: 'delete'
      }, (error, res, body) => {
        if(error) {
          return done(error);
        }
        
        assert.equal(body.id, 1);

        req('/', (error, res, body) => {
          assert.equal(body.length, 1, 'Only one message left');
          done(error);
        });
      });
    });
  });

  describe('todos service', function() {
    it('get works', function() {
      return app.service('todos').get('laundry').then(todo => {
        assert.equal(todo.id, 'laundry');
        assert.equal(todo.text, 'You have to do laundry');
        assert.ok(todo.modified);
      });
    });
  });
});
