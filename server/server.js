const express = require('express');

const path = require('path');

const SwaggerExpress = require('swagger-express-mw');

const app = express();

const config = {
  appRoot: path.join(__dirname, '..') // required config
};

require('./config/middleware')(app, express);

// commented out for now
// require('./config/routes')(app, express);

const port = process.env.PORT || 3000;

module.exports = app;

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) { throw err; }
  // install middleware
  swaggerExpress.register(app);
  app.listen(port);
});

