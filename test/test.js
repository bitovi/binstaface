const assert = require('assert');
const binstaface = require('../lib');

describe('my app test', function() {
  it('exports the message', function() {
    assert.equal(binstaface.message, 'Hello world');
  });
});
