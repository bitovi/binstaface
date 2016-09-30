const feathers = require('feathers');
const bodyParser = require('body-parser');
const path = require('path');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const memory = require('feathers-memory');
const hooks = require('feathers-hooks');

module.exports = function() {
  // Express app
  const app = feathers()
    .configure(rest())
    .configure(socketio())
    .configure(hooks())
    .use(bodyParser.json())
    .use(feathers.static(path.join(__dirname, '..', 'public')))
    .use('/messages', memory());

  app.use('/todos', {
    get(id) {
      return Promise.resolve({
        id, text: `You have to do ${id}`
      });
    }
  });

  app.service('todos').after({
    get(hook) {
      hook.result.modified = true;
    }
  });
  
  return app;
};
