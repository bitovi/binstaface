const express = require('express');
const bodyParser = require('body-parser');

module.exports = function() {
  // Express app
  const app = express().use(bodyParser.json());
  // Message store
  const messages = {};

  // A middleware that gets and parses the id
  const getId = (req, res, next) => {
    const number = parseInt(req.params.id, 10);
    
    if(!isNaN(number)) {
      req.id = number;
    }

    next();
  };

  // A middleware that tries to retrieve the message
  // based on the id from `getId`
  const getMessage = (req, res, next) => {
    const id = req.id;
    const message = messages[id];

    if(message === undefined) {
      return next(new Error('Record not found'));
    }

    req.message = message;

    next();
  };

  let id = 0;

  app.get('/messages', (req, res) => {
    const messageArray = Object.keys(messages).map(key => messages[key]);

    res.json(messageArray);
  });

  app.post('/messages', (req, res) => {
    const data = Object.assign({
      id: ++id
    }, req.body);

    messages[id] = data;

    res.json(data);
  });

  app.get('/messages/:id', getId, getMessage, (req, res) => {
    // `req.message` set by `getMessage` middleware
    res.json(req.message);
  });

  app.put('/messages/:id', getId, getMessage, (req, res) => {
    // `req.id` set by `getId` middleware
    const message = messages[req.id] = Object.assign({}, req.body, {
      id: req.id 
    }); // Always override id

    res.json(message);
  });

  app.patch('/messages/:id', getId, getMessage, (req, res) => {
    const message = messages[req.id] = Object.assign(req.message, req.body);

    res.json(message);
  });

  app.delete('/messages/:id', getId, getMessage, (req, res) => {
    const message = messages[req.id];

    delete messages[req.id];

    res.json(message);
  });

  // An Express error handler that prints the error message as JSON
  app.use((error, req, res, next) => { // eslint-disable-line
    res.status(500);
    res.json({ message: error.message });
  });

  return app;
};
